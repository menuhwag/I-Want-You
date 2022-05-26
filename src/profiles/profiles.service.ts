import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProfileEntity } from './entities/profile.entity';
import { Connection } from 'typeorm';
import { IProfilesRepository } from './repository/iprofiles.repository';

@Injectable()
export class ProfilesService {
    constructor(@Inject('ProfilesRepository') private profilesRepository: IProfilesRepository) {}

    public async findOneByUser(user: string): Promise<ProfileEntity> {
        const profile = await this.profilesRepository.findOneByUser(user);
        if (!profile) {
            console.log('findOneByUser() 프로필정보 없음');
            throw new NotFoundException();
        }
        return profile;
    }

    public async find(offset: number, limit: number): Promise<ProfileEntity[] | null> {
        return this.profilesRepository.find(offset, limit);
    }

    public async checkExists(user: string): Promise<Boolean> {
        const profile = await this.profilesRepository.findOneByUser(user);
        return profile !== null;
    }

    public async update(user: string, query: object): Promise<void> {
        const profile = await this.profilesRepository.findOneByUser(user);
        if (!profile) {
            throw new NotFoundException();
        }
        if (profile.user !== user) {
            throw new BadRequestException();
        }
        await this.profilesRepository.update(profile.uuid, query);
    }
}
