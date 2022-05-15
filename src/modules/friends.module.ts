import { Module } from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { FriendsController } from '../controllers/friends.controller';
import { RelationshipModule } from './relationship.module';
import { AuthModule } from './auth.module';

@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [RelationshipModule, AuthModule],
})
export class FriendsModule {}
