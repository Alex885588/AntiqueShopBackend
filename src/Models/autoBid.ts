import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Antiques } from './antiques';
import { User } from './user';

@Entity()
export class AutoBid {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    user_id: number;

    @ManyToOne(() => Antiques)
    @JoinColumn({ name: "antiques_id" })
    antiques: Antiques

    @Column()
    antiques_id: number;

    @Column()
    maximumBidAmount: number;

    @Column({ default: true })
    isActive: boolean;
}
