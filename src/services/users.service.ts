import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { ProfilesService } from './profiles.service';
import { ProfileEntity } from 'src/entities/profile.entity';
import { RelationshipEntity } from 'src/entities/relationship.entity';
const crypto = require('crypto');

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private logger: Logger,
        private emailService: EmailService,
        private authService: AuthService,
        private profilesService: ProfilesService,
        private connection: Connection,
    ) {
        this.logger = new Logger(UsersService.name);
    }

    public async create(username: string, email: string, password: string, nickname: string) {
        this.logger.debug('create() 회원가입 진행');

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const usernameExists = await this.checkUsernameExists(username);
            if (usernameExists) {
                this.logger.debug('create() 아이디 중복');
                throw new UnprocessableEntityException('아이디 중복');
            }

            const emailExists = await this.checkEmailExists(email);
            if (emailExists) {
                this.logger.debug('create() 이메일 중복');
                throw new UnprocessableEntityException('이메일 중복');
            }

            const nicnameExists = await this.checkNickExists(nickname);
            if (nicnameExists) {
                this.logger.debug('create() 닉네임 중복');
                throw new UnprocessableEntityException('닉네임 중복');
            }

            const verifyToken = uuid.v1();

            const user = this.createNewUserEntity(username, email, password, verifyToken, nickname);

            await queryRunner.manager.save(user);

            if (await this.profilesService.checkExists(user.uuid)) {
                this.logger.debug('create() 프로필 중복');
                throw new BadRequestException();
            }

            const profile = this.profilesService.createNewProfileEntity(user.uuid);

            await queryRunner.manager.save(profile);

            await queryRunner.commitTransaction();
            await this.emailService.sendVerification(email, verifyToken);
            this.logger.debug('create() 회원가입 완료');
            return 'Create User';
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.logger.debug('create() 트랜잭션 롤백');
            this.logger.error('create() 트랜잭션', e.stack);
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    public async verifyEmail(verifyToken: string) {
        const user = await this.userRepository.findOne({
            where: { verifyToken: verifyToken },
        });

        if (!user) {
            this.logger.debug('verifyEmail() 유저정보 없음');
            throw new BadRequestException('잘못된 접근입니다');
        }

        user.verifyToken = '';
        user.is_active = true;

        return await this.userRepository.save(user);
    }

    public async login(username: string, password: string) {
        // username으로 조회
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            this.logger.debug('login() 유저정보 없음');
            throw new UnauthorizedException();
        }
        // password 체크
        if (this.hash(password, user.foo) !== user.password) {
            // decoding
            this.logger.debug('login() 패스워드 불일치');
            throw new UnauthorizedException();
        }
        if (user.is_active !== true) {
            if (user.verifyToken !== '') {
                this.logger.debug('login() 이메일 인증 미실시');
                throw new UnauthorizedException('이메일 인증이 필요합니다');
            } else {
                this.logger.debug('login() 휴면 계정 예외');
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

    public async findAll(offset: number, limit: number) {
        return await this.userRepository.find();
    }

    public async findOne(id: string) {
        const user = await this.userRepository.findOne({
            select: ['uuid', 'username', 'email', 'nickname', 'allow_public', 'uuid'],
            where: { uuid: id },
        });
        if (user == null) {
            this.logger.debug('findOne() 유저정보 없음');
            throw new NotFoundException('해당 유저가 존재하지 않습니다.');
        }
        return user;
    }

    public async findList(idList: string[]) {
        const option = idList.map((id) => {
            const uuid = { uuid: id };
            return uuid;
        });
        console.log(option);
        return await this.userRepository.find({
            select: ['uuid', 'username', 'email', 'nickname', 'allow_public', 'is_active'],
            where: option,
        });
    }

    public async update(id: string, updateUserDto: UpdateUserDto) {
        let user = await this.userRepository.findOne({ where: { uuid: id } });
        if (!user) {
            this.logger.debug('update() 유저정보 없음');
            throw new NotFoundException();
        }
        for (const key in Object(updateUserDto)) {
            if (key == 'password') {
                user[key] = this.hash(updateUserDto[key] as string, user.foo);
            } else {
                user[key] = updateUserDto[key];
            }
        }
        await this.userRepository.save(user);
        return {
            statusCode: 200,
            message: ['Update Success'],
        };
    }

    public async remove(id: string) {
        this.logger.debug('remove() 회원탈퇴 진행');

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userRepository.findOne({ where: { uuid: id } });
            if (!user) {
                this.logger.debug('remove() 유저정보 없음');
                throw new NotFoundException();
            }
            await queryRunner.manager.delete(RelationshipEntity, { user_a_uuid: user.uuid });
            await queryRunner.manager.delete(RelationshipEntity, { user_b_uuid: user.uuid });
            await queryRunner.manager.delete(ProfileEntity, { user: user.uuid });
            await queryRunner.manager.delete(UserEntity, user);
            await queryRunner.commitTransaction();
            this.logger.debug('remove() 회원탈퇴 완료');
            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.logger.debug('remove() 트랜잭션 롤백');
            this.logger.error('remove() 트랜잭션', e.stack);
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    public async checkExists(key: 'id' | 'email' | 'nickname', value: string) {
        let user: UserEntity | null;
        switch (key) {
            case 'id':
                user = await this.userRepository.findOne({
                    where: { username: value },
                });
                break;
            case 'email':
                user = await this.userRepository.findOne({
                    where: { email: value },
                });
                break;
            case 'nickname':
                user = await this.userRepository.findOne({
                    where: { nickname: value },
                });
                break;
            default:
                this.logger.debug('checkExists() 잘못된 접근');
                throw new BadRequestException();
        }
        return user == null;
    }

    private createNewUserEntity(username: string, email: string, password: string, verifyToken: string, nickname: string): UserEntity {
        const user = new UserEntity();
        user.uuid = ulid();
        user.username = username;
        user.email = email;
        user.foo = this.generateSalt();
        user.password = this.hash(password, user.foo);
        user.verifyToken = verifyToken;
        user.nickname = nickname;
        user.allow_public = true;
        user.is_active = false;
        user.role = 'USER';
        return user;
    }

    private async checkUsernameExists(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { username: username },
        });
        return user !== null;
    }
    private async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        return user !== null;
    }
    private async checkNickExists(nickname: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { nickname: nickname },
        });
        return user !== null;
    }
    private generateSalt() {
        return crypto.randomBytes(64).toString('base64');
    }
    private hash(password: string, salt: string) {
        const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        return hashed;
    }
}
