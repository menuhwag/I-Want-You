import { Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RelationshipController],
  providers: [RelationshipService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
})
export class RelationshipModule {}
