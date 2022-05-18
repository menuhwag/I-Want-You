import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { RelationshipModule } from '../relationship/relationship.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [RelationshipModule, AuthModule],
})
export class FriendsModule {}
