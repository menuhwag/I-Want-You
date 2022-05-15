import { Logger, Module } from '@nestjs/common';
import { MyLogger } from 'src/services/mylogger.service';

@Module({
    providers: [MyLogger, Logger],
    exports: [MyLogger, Logger],
})
export class MyloggerModule {}
