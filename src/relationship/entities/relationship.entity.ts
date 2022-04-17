import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('Relationship')
export class Relationship {
    @PrimaryColumn()
    uuid: string;

    @Column()
    user_a_uuid: string;

    @Column()
    user_b_uuid: string;

    @Column()
    relationship: number;

    @Column()
    user_blocked: boolean;

    @Column()
    profile_blocked: boolean;
}