import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from 'src/Models/bid';
import { BidDto } from 'src/DTO/bid.DTO';
import { BidMapper } from 'src/Mapper/bid.mapper';

@Injectable()
export class BidService {
    constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
        private readonly bidMapper: BidMapper,
    ) { }

    async findAll(): Promise<BidDto[]> {
        const bids = await this.bidRepository.find();
        return bids.map(bid => this.bidMapper.toDto(bid));
    }

    async findOne(id: number): Promise<BidDto> {
        const bid = await this.bidRepository.findOneById(id);
        return this.bidMapper.toDto(bid);
    }

    async create(bidDto: BidDto): Promise<BidDto> {
        const bid = this.bidMapper.toEntity(bidDto);
        const createdBid = await this.bidRepository.save(bid);
        return this.bidMapper.toDto(createdBid);
    }

    async update(id: number, bidDto: BidDto): Promise<BidDto> {
        const existingBid = await this.bidRepository.findOneById(id);
        if (!existingBid) {
            return null;
        }
        const updatedBid = Object.assign(existingBid, bidDto);
        const savedBid = await this.bidRepository.save(updatedBid);
        return this.bidMapper.toDto(savedBid);
    }

    async delete(id: number): Promise<void> {
        await this.bidRepository.delete(id);
    }

    async getMaxBidAmountByUserId(userId: number): Promise<number> {
        const maxBid = await this.bidRepository
            .createQueryBuilder('bid')
            .select('MAX(bid.bidAmount)', 'maxBidAmount')
            .where('bid.user_id = :userId', { userId })
            .getRawOne();

        return maxBid ? maxBid.maxBidAmount : null;
    }

    async getHighestBid(antiques_id: number): Promise<Bid> {
        const highestBid = await this.bidRepository
            .createQueryBuilder('bid')
            .where('bid.antiques_id = :antiques_id', { antiques_id })
            .orderBy('bid.bidAmount', 'DESC')
            .getOne();
        return highestBid
    }

    async getBidsForAntique(antiqueId: number): Promise<any[]> {
        return await this.bidRepository
            .createQueryBuilder('bid')
            .select(['bid.bidAmount', 'user.username'])
            .innerJoin('bid.user', 'user')
            .where('bid.antiques_id = :antiqueId', { antiqueId })
            .getRawMany();
    }

    async getLastBidsByUserId(userId: number): Promise<Bid[]> {
        const highestBid = await this.bidRepository.createQueryBuilder('bid')
            .innerJoin('bid.antiques', 'antique')
            .select(['bid', 'antique.biddingInProgress', 'antique.name','antique.id','antique.currentBid'])
            .where('bid.user_id = :userId', { userId })
            .getMany();
        const antiquesIds = [...new Set(highestBid.map(bid => bid.antiques_id))];
        let arrBids: Bid[] = []
        for (let i = 0; i < antiquesIds.length; i++) {
            let result = this.getListOfMaxBidsOfEveryAntiqueId(antiquesIds[i], highestBid)
            arrBids.push(result)
        }
        return arrBids;
    }

    getListOfMaxBidsOfEveryAntiqueId(id: number, list: any) {
        let highestBid = 0
        let bidItem
        for (let i = 0; i < list.length; i++) {
            if ((list[i].antiques_id === id) && (list[i].bidAmount > highestBid)) {
                highestBid = list[i].bidAmount
                bidItem = list[i]
            }
        }
        return bidItem
    }

    async getUsersByAntiquesId(antiquesId: number): Promise<number[]> {
        const users = await this.bidRepository
            .createQueryBuilder('bid')
            .select('bid.user_id')
            .where('bid.antiques_id = :antiquesId', { antiquesId })
            .getMany();
        const uniqueUserId = [...new Set(users.map(bid => bid.user_id))];
        return uniqueUserId;
    }
}
