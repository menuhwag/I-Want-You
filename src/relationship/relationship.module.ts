import { Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RelationshipEntity } from './entities/relationship.entity';
import { MyloggerModule } from '../mylogger/mylogger.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { RelationshipRepository } from './repository/relationship.repository';

@Module({
    controllers: [RelationshipController],
    providers: [RelationshipService, { provide: 'RelationshipRepository', useClass: RelationshipRepository }],
    imports: [AuthModule, MyloggerModule, TypeOrmModule.forFeature([RelationshipEntity, UserEntity])],
    exports: [RelationshipService],
})
export class RelationshipModule {}
