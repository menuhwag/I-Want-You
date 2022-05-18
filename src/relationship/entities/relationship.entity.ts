import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Relationship')
export class RelationshipEntity {
    @PrimaryColumn()
    uuid: string;

    @Column()
    user_a_uuid: string;

    @Column()
    user_b_uuid: string;

    @Column()
    relationship: 'FRIEND' | 'COWORKER' | 'FAMILY' = 'FRIEND';

    @Column()
    user_blocked: boolean = false;

    @Column()
    profile_blocked: boolean = false;
}
