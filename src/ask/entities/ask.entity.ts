import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Ask')
export class AskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    asking: string;

    @Column()
    asked: string;

    @Column()
    target: string;

    @CreateDateColumn()
    createdAt: Date;
}
