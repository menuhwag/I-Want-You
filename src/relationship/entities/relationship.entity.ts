import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Relationship')
export class RelationshipEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
