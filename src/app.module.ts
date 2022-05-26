import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import emailConfig from './config/emailConfig';
import jwtConfig from './config/jwtConfig';
import { validationSchema } from './config/validationSchema';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { MyloggerModule } from './mylogger/mylogger.module';
import { RelationshipModule } from './relationship/relationship.module';
import { ProfilesModule } from './profiles/profiles.module';

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
        AuthModule,
        FriendsModule,
        MyloggerModule,
        RelationshipModule,
        ProfilesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
