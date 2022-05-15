import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import emailConfig from './config/emailConfig';
import jwtConfig from './config/jwtConfig';
import { validationSchema } from './config/validationSchema';
import { EmailModule } from './modules/email.module';
import { AuthModule } from './modules/auth.module';
import { FriendsModule } from './modules/friends.module';
import { MyloggerModule } from './modules/mylogger.module';

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV == undefined ? 'development' : process.env.NOVE_ENV}.env`],
            load: [emailConfig, jwtConfig],
            isGlobal: true,
            validationSchema,
        }),
        TypeOrmModule.forRoot({
            type: 'mariadb',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: 'iwantu',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
        }),
        EmailModule,
        AuthModule,
        FriendsModule,
        MyloggerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
