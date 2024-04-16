import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Bid } from './bid';

@Entity()
export class Antiques {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    currentBid: number;

    @Column()
    biddingTimeLimit: Date;

    @Column({ default: true })
    biddingInProgress: boolean;

    @Column()
    antiquesImg: string;

    @OneToMany(() => Bid, bid => bid.antiques_id, { cascade: true })
    bids: Bid[];
}
