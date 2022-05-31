import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MyloggerModule } from 'src/mylogger/mylogger.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';
import { AskEntity } from './entities/ask.entity';
import { AskRepository } from './repository/ask.repository';

@Module({
    providers: [AskService, { provide: 'AskRepository', useClass: AskRepository }],
    controllers: [AskController],
    imports: [AuthModule, MyloggerModule, TypeOrmModule.forFeature([AskEntity, UserEntity])],
})
export class AskModule {}
