import { IsNotEmpty, IsString } from 'class-validator';

export class EmailVerifyDto {
    @IsString()
    @IsNotEmpty()
    verifyToken: string;
}
