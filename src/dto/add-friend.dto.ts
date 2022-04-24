import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class AddFriendDto {
    @IsString()
    @IsNotEmpty()
    friendUUID: string;

    @IsString()
    relationship: 'FRIEND' | 'COWORKER' | 'FAMILY' = 'FRIEND';

    @IsBoolean()
    user_blocked: boolean = false;

    @IsBoolean()
    profile_blocked: boolean = false;
}
