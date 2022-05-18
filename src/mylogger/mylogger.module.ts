import { Logger, Module } from '@nestjs/common';
import { MyLogger } from './mylogger.service';

@Module({
    providers: [MyLogger, Logger],
    exports: [MyLogger, Logger],
})
export class MyloggerModule {}
