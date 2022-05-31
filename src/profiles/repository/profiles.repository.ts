import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsSelectByString, Repository } from 'typeorm';
import { ProfileEntity } from '../entities/profile.entity';
import { IProfilesRepository } from './iprofiles.repository';

export class ProfilesRepository implements IProfilesRepository {
    constructor(@InjectRepository(ProfileEntity) private prorilesRepository: Repository<ProfileEntity>) {}
    async findOneByUUID(id: string, select?: FindOptionsSelect<ProfileEntity> | FindOptionsSelectByString<ProfileEntity>): Promise<ProfileEntity | null> {
        const profile = await this.prorilesRepository.findOne({
            select,
            where: { id },
        });
        if (!profile) {
            return null;
        }
        return profile;
    }

    async findOneByUser(user: string, select?: FindOptionsSelect<ProfileEntity> | FindOptionsSelectByString<ProfileEntity>): Promise<ProfileEntity | null> {
        const profile = await this.prorilesRepository.findOne({
            select,
            where: { user },
        });
        if (!profile) {
            return null;
        }
        return profile;
    }

    async findAll(offset: number, limit: number): Promise<ProfileEntity[] | null> {
        const profiles = await this.prorilesRepository.find({ skip: offset, take: limit });
        if (!profiles) {
            return null;
        }
        return profiles;
    }

    async update(id: string, query: object): Promise<void> {
        const profile = await this.prorilesRepository.findOne({ where: { id } });
        if (profile instanceof ProfileEntity) {
            for (const key in query) {
                profile[key] = query[key];
            }
            await this.prorilesRepository.save(profile);
        }
    }
}
