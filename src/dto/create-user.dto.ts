import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsEmail, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @Transform((params) => params.value.replace(/\s/gi, ''))
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    readonly username: string;

    @Transform((params) => params.value.trim())
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,20}$/)
    readonly password: string; // Todo. 암호화

    @Transform((params) => params.value.replace(/\s/g, ''))
    @MinLength(2)
    @MaxLength(15)
    readonly nickname: string;
}
