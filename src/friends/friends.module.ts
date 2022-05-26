import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { RelationshipModule } from '../relationship/relationship.module';
import { AuthModule } from '../auth/auth.module';
import { MyloggerModule } from 'src/mylogger/mylogger.module';

@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [RelationshipModule, AuthModule, MyloggerModule],
})
export class FriendsModule {}
