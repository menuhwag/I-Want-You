import { Body, Controller, DefaultValuePipe, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { UserInfo } from 'src/utile/decorators/user.decorator';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { RolesGuard } from 'src/utile/guard/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService, private logger: Logger) {
        this.logger = new Logger(ProfilesController.name);
    }

    @Get()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    findAll(@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
        return this.profilesService.find(offset, limit);
    }

    @Get('me')
    findMyProfile(@UserInfo('uuid') me: string) {
        return this.profilesService.findOneByUser(me);
    }

    @Patch('me')
    update(@UserInfo('uuid') me: string, @Body() updateProfileDto: UpdateProfileDto): Promise<void> | void {
        let query = Object(updateProfileDto);
        if (Object.keys(query).includes('hobby') && query.hobby.length > 0) {
            let hobbyStr = '';
            query.hobby.forEach((element) => {
                hobbyStr += element + ';';
            });
            query.hobby = hobbyStr;
        }
        return this.profilesService.update(me, query);
    }

    @Get(':user')
    findOneByUser(@Param('user') user: string) {
        return this.profilesService.findOneByUser(user);
    }
}
