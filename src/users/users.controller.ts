import { Controller, Get, Post, Body, Query, Patch, Param, Delete, HttpCode, ParseIntPipe, DefaultValuePipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { UserInfo } from 'src/utile/decorators/User.decorator';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { RolesGuard } from 'src/utile/guard/roles.guard';

interface UserInfo{
  uuid: string;
  username: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    const { username, email, password, nickname } = createUserDto;
    return await this.usersService.create(username, email, password, nickname); 
  }

  @HttpCode(200)
  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: EmailVerifyDto): Promise<void> {
    const {verifyToken} = verifyEmailDto;
    await this.usersService.verifyEmail(verifyToken);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return await this.usersService.login(username, password);
  }

  @Get('/exists')
  async checkExists(@Query('key') key: 'id'|'email'|'nickname', @Query('value') value: string): Promise<boolean>{
    return await this.usersService.checkExists(key, value);
  }

  @Get('/test')
  async test(){
    return await this.usersService.test();
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(
    @UserInfo('uuid') uuid,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<UserEntity[]> {
    return await this.usersService.findAll(uuid, offset, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@UserInfo('uuid') uuid, @Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(uuid, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@UserInfo('uuid') uuid, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uuid, id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
