import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { EmailModule } from 'src/modules/email.module';
import { AuthModule } from 'src/modules/auth.module';
import { MyloggerModule } from './mylogger.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [EmailModule, AuthModule, MyloggerModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
