import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('Relationship')
export class RelationshipEntity {
    @PrimaryColumn()
    uuid: string;

    @Column()
    user_a_uuid: string;

    @Column()
    user_b_uuid: string;

    @Column()
    relationship: 'FRIEND' | 'COWORKER' | 'FAMILY';

    @Column()
    user_blocked: boolean;

    @Column()
    profile_blocked: boolean;
}