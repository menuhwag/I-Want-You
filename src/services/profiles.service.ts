import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/entities/profile.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class ProfilesService {
    constructor(@InjectRepository(ProfileEntity) private profilesRepository: Repository<ProfileEntity>, private logger: Logger, private connection: Connection) {
        this.logger = new Logger(ProfilesService.name);
    }

    public async create(user: string) {
        this.logger.debug('create() 프로필 생성 진행');
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (await this.checkExists(user)) {
                this.logger.debug('create() 프로필 중복');
                throw new BadRequestException();
            }
            const profile = this.createNewProfileEntity(user);
            await queryRunner.manager.save(profile);
            await queryRunner.commitTransaction();
        } catch (e) {
            this.logger.debug('function() create 트랜잭션 롤백');
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    public async findOneByUser(user: string) {
        const profile = await this.profilesRepository.findOne({ where: { user } });
        if (!profile) {
            this.logger.debug('findOneByUser() 프로필정보 없음');
            throw new NotFoundException();
        }
        return profile;
    }

    public createNewProfileEntity(user: string): ProfileEntity {
        const profile = new ProfileEntity();
        profile.uuid = ulid();
        profile.user = user;
        return profile;
    }

    public async checkExists(user: string): Promise<Boolean> {
        const profile = await this.profilesRepository.findOne({ where: { user } });
        return profile !== null;
    }
}
