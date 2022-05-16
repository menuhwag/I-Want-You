import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Profile')
export class ProfileEntity {
    @PrimaryColumn()
    uuid: string;

    @Column()
    user: string;

    @Column()
    name: string = '';

    @Column()
    birth: Date = new Date(1900, 0, 1);

    @Column()
    hobby: string = '';
}
