import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { EmailModule } from 'src/modules/email.module';
import { AuthModule } from 'src/modules/auth.module';
import { MyloggerModule } from './mylogger.module';
import { ProfilesModule } from './profiles.module';
import { ProfileEntity } from 'src/entities/profile.entity';
import { RelationshipEntity } from 'src/entities/relationship.entity';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [EmailModule, AuthModule, MyloggerModule, ProfilesModule, TypeOrmModule.forFeature([UserEntity, ProfileEntity, RelationshipEntity])],
})
export class UsersModule {}
