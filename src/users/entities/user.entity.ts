import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    verifyToken: string;

    @Column({ length: 20 })
    username: string;

    @Column({ length: 60 })
    email: string;

    @Column()
    password: string;

    @Column()
    foo: string;

    @Column({ length: 15 })
    nickname: string;

    @Column()
    allow_public: boolean = true;

    @Column()
    is_active: boolean = false;

    @Column()
    role: string = 'USER';
}
