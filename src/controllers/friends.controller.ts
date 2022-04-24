import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { AddFriendDto } from '../dto/add-friend.dto';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { UserInfo } from 'src/utile/decorators/user.decorator';

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
    return this.friendsService.findByUUID(myUUID);
  }

  @Get(':uuid')
  getOtherFriends(@Param('uuid') uuid: string) {
    return this.friendsService.findByUUID(uuid);
  }
}
