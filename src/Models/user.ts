import { UserRole } from '../Enums/user.role';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    userStatus: UserRole;

    @Column({ nullable: true })
    autoBidBalance: number;

    @Column({ nullable: true })
    notificationParcentage: number;
}
