import { IsNotEmpty, IsString } from "class-validator";
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
    @IsNotEmpty()
    relationship: 'FRIEND' | 'COWORKER' | 'FAMILY';
}
