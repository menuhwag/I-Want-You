import { Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RelationshipEntity } from './entities/relationship.entity';

@Module({
  controllers: [RelationshipController],
  providers: [RelationshipService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, RelationshipEntity])
  ],
})
export class RelationshipModule {}
