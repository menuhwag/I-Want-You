import { UserEntity } from '../entities/user.entity';
import { FindOptionsSelect, FindOptionsSelectByString } from 'typeorm';

export interface IUserRepository {
    findOneByUsername(username: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null>;
    findOneByEmail(email: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null>;
    findOneByNickname(nickname: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null>;
    findOneByUUID(UUID: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null>;
    findOneByVerifyToken(verifyToken: string, select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity | null>;
    findByUUID(UUIDs: object[], select?: FindOptionsSelect<UserEntity> | FindOptionsSelectByString<UserEntity>): Promise<UserEntity[] | null>;
    find(offset: number, limit: number): Promise<UserEntity[] | null>;
    save(UUID: string, username: string, email: string, password: string, nickname: string, verifyToken: string, foo: string): Promise<void>;
    update(UUID: string, query: object): Promise<void>;
    delete(UUID: string): Promise<void>;
}
