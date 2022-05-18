import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsSelect, FindOptionsSelectByString } from 'typeorm/find-options/FindOptionsSelect';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from './iusers.repository';

@Injectable()
export class UsersRepository implements IUserRepository {
    constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}
    async findOneByUsername(username: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null> {
        return await this.usersRepository.findOne({
            select,
            where: { username },
        });
    }
    async findOneByEmail(email: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null> {
        return await this.usersRepository.findOne({
            select,
            where: { email },
        });
    }
    async findOneByNickname(nickname: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null> {
        return await this.usersRepository.findOne({
            select,
            where: { nickname },
        });
    }
    async findOneByUUID(UUID: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null> {
        return await this.usersRepository.findOne({
            select,
            where: { uuid: UUID },
        });
    }
    async findOneByVerifyToken(verifyToken: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null> {
        return await this.usersRepository.findOne({
            select,
            where: { verifyToken },
        });
    }
    async findByUUID(UUIDs: object[], select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity[] | null> {
        const users = await this.usersRepository.find({
            select,
            where: UUIDs,
        });
        if (!users) {
            return null;
        }
        return users;
    }
    async find(offset: number, limit: number): Promise<UserEntity[] | null> {
        const users = await this.usersRepository.find({ skip: offset, take: limit });
        if (!users) {
            return null;
        }
        return users;
    }
    async save(uuid: string, username: string, email: string, password: string, nickname: string, verifyToken: string, foo: string): Promise<void> {
        const user = new UserEntity();
        user.uuid = uuid;
        user.username = username;
        user.email = email;
        user.foo = foo;
        user.password = password;
        user.verifyToken = verifyToken;
        user.nickname = nickname;

        await this.usersRepository.save(user);
    }
    async update(UUID: string, query: object): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { uuid: UUID } });
        if (user instanceof UserEntity) {
            for (const key in query) {
                user[key] = query[key];
            }
            await this.usersRepository.save(user);
        }
    }
    async delete(UUID: string): Promise<void> {
        await this.usersRepository.delete(UUID);
    }
}
