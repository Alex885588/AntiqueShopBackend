import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Antiques } from './antiques';
import { User } from './user';
import { BidStatus } from '../Enums/bid.status';

@Entity()
export class Bid {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    user_id: number;

    @ManyToOne(() => Antiques,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: "antiques_id" })
    antiques: Antiques

    @Column()
    antiques_id: number;

    @Column()
    bidAmount: number;

    @Column({ nullable: true })
    bidStatus: BidStatus;
}
