import { Controller, Get, Post, Body, Query, Patch, Param, Delete, HttpCode, ParseIntPipe, DefaultValuePipe, UseGuards, Inject, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { RolesGuard } from 'src/utile/guard/roles.guard';
import { OwnerGuard } from 'src/utile/guard/owner.guard';
import { UserInfo } from 'src/utile/decorators/user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly logger: Logger) {
        this.logger = new Logger(UsersController.name);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<void> {
        this.logger.debug('회원가입 요청');
        const { username, email, password, nickname } = createUserDto;
        return this.usersService.createUserAndProfile(username, email, password, nickname);
    }

    @HttpCode(200)
    @Post('/email-verify')
    verifyEmail(@Query() verifyEmailDto: EmailVerifyDto): Promise<void> {
        this.logger.debug('이메일 인증');
        const { verifyToken } = verifyEmailDto;
        return this.usersService.verifyEmail(verifyToken);
    }

    @HttpCode(200)
    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<string> {
        const { username, password } = loginDto;
        this.logger.log(`${username} 로그인 시도`);
        return this.usersService.login(username, password);
    }

    @Get('/exists')
    checkExists(@Query('key') key: 'id' | 'email' | 'nickname', @Query('value') value: string): Promise<boolean> {
        this.logger.debug(`중복체크 요청, ${JSON.stringify({ key, value })}`);
        return this.usersService.checkExists(key, value);
    }

    @Get()
    @Roles('ADMIN')
    @UseGuards(AuthGuard, RolesGuard)
    findAll(
        @UserInfo('username') username: string,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<UserEntity[] | null> {
        this.logger.log(`[${username}] 유저 목록 요청`);
        return this.usersService.findAll(offset, limit);
    }

    @Get(':id')
    @UseGuards(AuthGuard, OwnerGuard)
    findOne(@Param('id') id: string): Promise<UserEntity | null> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, OwnerGuard)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
        const query = Object(updateUserDto);
        return this.usersService.update(id, query);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, OwnerGuard)
    @HttpCode(204)
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
