import { IsArray, IsString, Matches } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    readonly name: string;

    @Matches(/^\d{4}$/)
    @IsString()
    readonly birthyear: string;

    @Matches(/^(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)
    @IsString()
    readonly birthday: string;

    @IsArray()
    readonly hobby: string[];
}
