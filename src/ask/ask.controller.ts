import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Logger, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { UserInfo } from 'src/utile/decorators/user.decorator';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { RolesGuard } from 'src/utile/guard/roles.guard';
import { AskService } from './ask.service';
import { CreateAskDto } from './dto/create-ask.dto';
import { AskEntity } from './entities/ask.entity';

@UseGuards(AuthGuard)
@Controller('ask')
export class AskController {
    constructor(private readonly askService: AskService, private logger: Logger) {
        this.logger = new Logger(AskController.name);
    }
    @Post()
    ask(@UserInfo('id') asking, @Body() createAskDto: CreateAskDto): Promise<void> {
        const { asked, target } = createAskDto;
        this.logger.debug('요청 생성');
        return this.askService.ask(asking, asked, target);
    }

    @Get()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    findAll(@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<AskEntity[]> {
        return this.askService.findAll(offset, limit);
    }

    @Get('me')
    findMine(@UserInfo('id') user, @Query('opt') opt: 'asked' | 'asking'): Promise<AskEntity[]> {
        let ask;
        switch (opt) {
            case 'asked':
                ask = this.askService.findAskedAll(user);
                break;
            case 'asking':
                ask = this.askService.findAskingAll(user);
                break;
            default:
                throw new BadRequestException();
        }
        return ask;
    }

    @Get(':id')
    findOneByUUID(@UserInfo('id') user, @Param('id') id: string): Promise<AskEntity> {
        return this.askService.findOneByUUID(user, id);
    }

    @Delete(':id')
    cancelAsk(@UserInfo('id') user, @Param('id') id: string): Promise<void> {
        this.logger.debug('요청 삭제');
        return this.askService.cancelAsk(user, id);
    }
}
