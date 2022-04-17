import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly configService: ConfigService
  ) {}
  // api 도큐멘테이션 제공
  @Get()
  root(): string | undefined{

    return this.configService.get('DATABASE_HOST');

  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
