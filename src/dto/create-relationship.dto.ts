import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateRelationshipDto {
    @Column()
    @IsString()
    @IsNotEmpty()
    user_a_uuid: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    user_b_uuid: string;

    @Column()
    @IsString()
    relationship: 'FRIEND' | 'COWORKER' | 'FAMILY';

    @Column()
    @IsBoolean()
    user_blocked: boolean;

    @Column()
    @IsBoolean()
    profile_blocked: boolean;
}
