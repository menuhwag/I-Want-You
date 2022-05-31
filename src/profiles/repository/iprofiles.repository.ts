import { FindOptionsSelect, FindOptionsSelectByString } from 'typeorm';
import { ProfileEntity } from '../entities/profile.entity';

export interface IProfilesRepository {
    findOneByUUID(id: string, select?: FindOptionsSelect<ProfileEntity> | FindOptionsSelectByString<ProfileEntity>): Promise<ProfileEntity | null>;
    findOneByUser(user: string, select?: FindOptionsSelect<ProfileEntity> | FindOptionsSelectByString<ProfileEntity>): Promise<ProfileEntity | null>;
    findAll(offset: number, limit: number): Promise<ProfileEntity[] | null>;
    update(id: string, query: object): Promise<void>;
}
