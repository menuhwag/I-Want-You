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
    birthyear: string = '1900';

    @Column()
    birthday: string = '0101';

    @Column()
    hobby: string = '';
}
