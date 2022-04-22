import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/utile/guard/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
})
export class UsersModule {}
