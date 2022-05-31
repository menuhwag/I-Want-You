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

    @Post('me/:id')
    add(@UserInfo('id') myUUID: string, @Param('id') friendUUID: string) {
        if (myUUID == friendUUID) {
            throw new BadRequestException();
        }
        return this.friendsService.add(myUUID, friendUUID);
    }

    @Get('me')
    getMyFriends(@UserInfo('id') myUUID: string) {
        return this.friendsService.findByUser(myUUID);
    }

    @Get('me/:uuid')
    getMyFriend(@UserInfo('id') myUUID: string, @Param('uuid') friendUUID: string) {
        return this.friendsService.findMyFriend(myUUID, friendUUID);
    }

    @Patch('me/:uuid')
    patchMyFriend(@UserInfo('id') myUUID: string, @Param('uuid') friendUUID: string, @Body() updateRelDto: UpdateRelationshipDto) {
        return this.friendsService.updateMyFriend(myUUID, friendUUID, updateRelDto);
    }

    @HttpCode(204)
    @Delete('me/:uuid')
    deleteMyFriend(@UserInfo('id') myUUID: string, @Param('uuid') friendUUID: string) {
        return this.friendsService.deleteMyFriend(myUUID, friendUUID);
    }

    @Get(':id')
    getOtherFriends(@Param('id') id: string) {
        return this.friendsService.findByUser(id);
    }
}
