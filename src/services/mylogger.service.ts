import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export class MyLogger implements LoggerService {
  constructor(
    private logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
            winston.format((info, opts) => {
              info.timestamp = `${info.timestamp}`;
              info.level = `[${info.level.toUpperCase()}]`;
              info.context = `\x1b[33m[${info.context}]\x1b[0m`;
              if (info.stack) {
                info.message = `${info.message}\n${info.stack}`;
              }
              return info;
            })(),
            winston.format.colorize({ message: true, level: true }),
            winston.format.printf((info) => {
              return `[I-Want-You] - ${info.timestamp} ${info.level} ${info.context} ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  ) {}

  error(message: any, stack?: string, context?: string): void {
    this.logger.error(message, { stack, context });
  }

  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }
}
