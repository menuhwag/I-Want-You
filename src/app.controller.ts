import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.logger = new Logger(AppController.name);
  }
  // api 도큐멘테이션 제공
  @Get()
  root(): string | undefined{
    return this.configService.get('DATABASE_HOST');
  }

  @Get('/hello')
  getHello(): string {
    this.logger.log("hello");
    return this.appService.getHello();
  }
}
