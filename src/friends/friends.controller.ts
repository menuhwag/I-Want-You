import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, HttpCode } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { UserInfo } from 'src/utile/decorators/user.decorator';
import { UpdateRelationshipDto } from '../relationship/dto/update-relationship.dto';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @Post()
    add(@UserInfo('uuid') myUUID: string, @Body() addFriendDto: AddFriendDto) {
        const { friendUUID } = addFriendDto;
        if (myUUID == friendUUID) {
            throw new BadRequestException();
        }
        return this.friendsService.add(myUUID, friendUUID);
    }

    @Get('me')
    getMyFriends(@UserInfo('uuid') myUUID: string) {
        return this.friendsService.findByUser(myUUID);
    }

    @Get('me/:uuid')
    getMyFriend(@UserInfo('uuid') myUUID: string, @Param('uuid') friendUUID: string) {
        return this.friendsService.findMyFriend(myUUID, friendUUID);
    }

    @Patch('me/:uuid')
    patchMyFriend(@UserInfo('uuid') myUUID: string, @Param('uuid') friendUUID: string, @Body() updateRelDto: UpdateRelationshipDto) {
        return this.friendsService.updateMyFriend(myUUID, friendUUID, updateRelDto);
    }

    @HttpCode(204)
    @Delete('me/:uuid')
    deleteMyFriend(@UserInfo('uuid') myUUID: string, @Param('uuid') friendUUID: string) {
        return this.friendsService.deleteMyFriend(myUUID, friendUUID);
    }

    @Get(':uuid')
    getOtherFriends(@Param('uuid') uuid: string) {
        return this.friendsService.findByUser(uuid);
    }
}
