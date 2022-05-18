import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MyloggerModule } from '../mylogger/mylogger.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { EmailService } from './adapter/email.service';
import { UsersRepository } from './repository/users.repository';

@Module({
    controllers: [UsersController],
    providers: [UsersService, EmailService, { provide: 'UsersRepository', useClass: UsersRepository }],
    imports: [AuthModule, MyloggerModule, ProfilesModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
