import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAskDto {
    @IsString()
    @IsNotEmpty()
    asked: string;

    @IsString()
    @IsNotEmpty()
    target: string;
}
