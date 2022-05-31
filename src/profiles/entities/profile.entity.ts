import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Profile')
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
