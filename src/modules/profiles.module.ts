import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from 'src/controllers/profiles.controller';
import { ProfileEntity } from 'src/entities/profile.entity';
import { ProfilesService } from 'src/services/profiles.service';
import { MyloggerModule } from './mylogger.module';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [MyloggerModule, TypeOrmModule.forFeature([ProfileEntity])],
    exports: [ProfilesService],
})
export class ProfilesModule {}
