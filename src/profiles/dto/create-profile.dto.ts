import { IsArray, IsDate, IsString } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    readonly name: string;

    @IsDate()
    readonly birth: Date;

    @IsArray()
    readonly hobby: string[];
}
