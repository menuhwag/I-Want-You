import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EmailService } from './adapter/email.service';
import { Connection } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UserEntity } from './entities/user.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { ProfileEntity } from '../profiles/entities/profile.entity';
import { RelationshipEntity } from '../relationship/entities/relationship.entity';
import { IUserRepository } from './repository/iusers.repository';
const crypto = require('crypto');

@Injectable()
export class UsersService {
    constructor(
        @Inject('UsersRepository') private usersRepository: IUserRepository,
        private emailService: EmailService,
        private authService: AuthService,
        private profilesService: ProfilesService,
        private connection: Connection,
    ) {}

    public async createUserAndProfile(username: string, email: string, password: string, nickname: string): Promise<void> {
        console.log('create() 회원가입 진행');

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 유저 중복체크
            const usernameExists = await this.usersRepository.findOneByUsername(username);
            if (usernameExists) {
                console.log('create() 아이디 중복');
                throw new UnprocessableEntityException('아이디 중복');
            }

            const emailExists = await this.usersRepository.findOneByEmail(email);
            if (emailExists) {
                console.log('create() 이메일 중복');
                throw new UnprocessableEntityException('이메일 중복');
            }

            const nicnameExists = await this.usersRepository.findOneByNickname(nickname);
            if (nicnameExists) {
                console.log('create() 닉네임 중복');
                throw new UnprocessableEntityException('닉네임 중복');
            }
            ////

            // 유저 Entity 생성
            const user = new UserEntity();
            user.uuid = ulid();
            user.username = username;
            user.email = email;
            user.foo = this.generateSalt();
            user.password = this.hash(password, user.foo);
            user.verifyToken = uuid.v1();
            user.nickname = nickname;
            user.allow_public = true;
            user.is_active = false;
            user.role = 'USER';
            ////

            await queryRunner.manager.save(user); // 유저 Entity 저장

            // 프로필 중복체크
            if (await this.profilesService.checkExists(user.uuid)) {
                console.log('create() 프로필 중복');
                throw new BadRequestException();
            }
            ////

            // 프로필 Entity 생성
            const profile = new ProfileEntity();
            profile.uuid = ulid();
            profile.user = user.uuid;
            ////

            await queryRunner.manager.save(profile); // 프로필 Entity 저장

            await queryRunner.commitTransaction(); // 트랙잭션 커밋
            await this.emailService.sendVerification(email, user.verifyToken); // 인증메일 전송
            console.log('create() 회원가입 완료');
        } catch (e) {
            await queryRunner.rollbackTransaction(); // 트랜잭션 롤백
            console.log('create() 트랜잭션 롤백');
            console.log(`create() 트랜잭션\n${e.stack}`);
            throw e;
        } finally {
            await queryRunner.release(); // 트랜잭션 릴리즈
            console.log('트랜잭션 릴리즈');
        }
    }

    public async verifyEmail(verifyToken: string): Promise<void> {
        const user = await this.usersRepository.findOneByVerifyToken(verifyToken, ['uuid']);

        if (!user) {
            console.log('verifyEmail() 유저정보 없음');
            throw new BadRequestException('잘못된 접근입니다');
        }

        const query = {
            verifyToken: '',
            is_active: true,
        };

        await this.usersRepository.update(user.uuid, query);
    }

    public async login(username: string, password: string): Promise<string> {
        // username으로 조회
        const user = await this.usersRepository.findOneByUsername(username, ['uuid', 'username', 'password', 'foo', 'is_active', 'verifyToken', 'email']);
        if (!user) {
            console.log('login() 유저정보 없음');
            throw new UnauthorizedException();
        }
        // password 체크
        if (this.hash(password, user.foo) !== user.password) {
            // decoding
            console.log('login() 패스워드 불일치');
            throw new UnauthorizedException();
        }
        // 계정 인증 및 활성화 체크
        if (user.is_active !== true) {
            if (user.verifyToken !== '') {
                console.log('login() 이메일 인증 미실시');
                throw new UnauthorizedException('이메일 인증이 필요합니다');
            } else {
                console.log('login() 휴면 계정 예외');
                throw new UnauthorizedException('휴면계정입니다');
            }
        }
        // jwt 발급
        const payload = {
            uuid: user.uuid,
            username: user.username,
            email: user.email,
        };
        return await this.authService.login(payload);
    }

    public async findAll(offset: number, limit: number): Promise<UserEntity[] | null> {
        return await this.usersRepository.find(offset, limit);
    }

    public async findOne(id: string): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOneByUUID(id);
        if (user == null) {
            console.log('findOne() 유저정보 없음');
            throw new NotFoundException('해당 유저가 존재하지 않습니다.');
        }
        return user;
    }

    public async findList(idList: string[]): Promise<UserEntity[] | null> {
        const uuids = idList.map((id) => {
            const uuid = { uuid: id };
            return uuid;
        });
        console.log(uuids);
        return await this.usersRepository.findByUUID(uuids, ['uuid', 'username', 'email', 'nickname', 'allow_public', 'is_active']);
    }

    public async update(id: string, query: object): Promise<void> {
        let user = await this.usersRepository.findOneByUUID(id);
        if (!user) {
            console.log('update() 유저정보 없음');
            throw new NotFoundException();
        }
        for (const key in query) {
            if (key == 'password') {
                query[key] = this.hash(query[key] as string, user.foo);
            }
        }
        await this.usersRepository.update(id, query);
    }

    public async remove(id: string): Promise<void> {
        console.log('remove() 회원탈퇴 진행');

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.usersRepository.findOneByUUID(id);
            if (!user) {
                console.log('remove() 유저정보 없음');
                throw new NotFoundException();
            }
            // await queryRunner.manager.delete(RelationshipEntity, [{ user_a_uuid: user.uuid }, { user_b_uuid: user.uuid }]); // Not Working
            await queryRunner.manager.delete(RelationshipEntity, { user_a_uuid: user.uuid });
            await queryRunner.manager.delete(RelationshipEntity, { user_b_uuid: user.uuid });
            await queryRunner.manager.delete(ProfileEntity, { user: user.uuid });
            await queryRunner.manager.delete(UserEntity, user);
            await queryRunner.commitTransaction();
            console.log('remove() 회원탈퇴 완료');
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.log('remove() 트랜잭션 롤백');
            console.log(`remove() 트랜잭션\n${e.stack}`);
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    public async checkExists(key: 'id' | 'email' | 'nickname', value: string): Promise<boolean> {
        let user: UserEntity | null;
        switch (key) {
            case 'id':
                user = await this.usersRepository.findOneByUsername(value);
                break;
            case 'email':
                user = await this.usersRepository.findOneByEmail(value);
                break;
            case 'nickname':
                user = await this.usersRepository.findOneByNickname(value);
                break;
            default:
                console.log('checkExists() 잘못된 접근');
                throw new BadRequestException();
        }
        return user == null;
    }

    private generateSalt(): string {
        return crypto.randomBytes(64).toString('base64');
    }
    private hash(password: string, salt: string): string {
        const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        return hashed;
    }
}
