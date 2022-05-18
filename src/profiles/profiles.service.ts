import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
    constructor(@InjectRepository(ProfileEntity) private profilesRepository: Repository<ProfileEntity>, private logger: Logger, private connection: Connection) {
        this.logger = new Logger(ProfilesService.name);
    }

    public async findOneByUser(user: string) {
        const profile = await this.profilesRepository.findOne({ where: { user } });
        if (!profile) {
            this.logger.debug('findOneByUser() 프로필정보 없음');
            throw new NotFoundException();
        }
        return profile;
    }

    public async checkExists(user: string): Promise<Boolean> {
        const profile = await this.profilesRepository.findOne({ where: { user } });
        return profile !== null;
    }
}
