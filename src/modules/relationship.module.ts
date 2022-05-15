import { Module } from '@nestjs/common';
import { RelationshipService } from '../services/relationship.service';
import { RelationshipController } from '../controllers/relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from 'src/modules/auth.module';
import { RelationshipEntity } from '../entities/relationship.entity';
import { MyloggerModule } from './mylogger.module';

@Module({
  controllers: [RelationshipController],
  providers: [RelationshipService],
  imports: [
    AuthModule,
    MyloggerModule,
    TypeOrmModule.forFeature([UserEntity, RelationshipEntity])
  ],
  exports: [RelationshipService]
})
export class RelationshipModule {}
