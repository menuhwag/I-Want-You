import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
    @PrimaryColumn()
    uuid: string;

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
    allow_public: boolean;

    @Column()
    is_active: boolean;

    @Column()
    role: string;
}
