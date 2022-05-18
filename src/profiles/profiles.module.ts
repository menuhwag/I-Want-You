import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfileEntity } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { MyloggerModule } from '../mylogger/mylogger.module';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [MyloggerModule, TypeOrmModule.forFeature([ProfileEntity])],
    exports: [ProfilesService],
})
export class ProfilesModule {}
