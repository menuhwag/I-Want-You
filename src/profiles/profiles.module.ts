import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfileEntity } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { MyloggerModule } from '../mylogger/mylogger.module';
import { ProfilesRepository } from './repository/profiles.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService, { provide: 'ProfilesRepository', useClass: ProfilesRepository }],
    imports: [MyloggerModule, TypeOrmModule.forFeature([ProfileEntity, UserEntity]), AuthModule],
    exports: [ProfilesService],
})
export class ProfilesModule {}
