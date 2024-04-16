// autoBid.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutoBid } from 'src/Models/autoBid';
import { AutoBidDto } from 'src/DTO/autoBid.DTO';
import { AutoBidMapper } from 'src/Mapper/autoBid.mapper';

@Injectable()
export class AutoBidService {
    constructor(
        @InjectRepository(AutoBid)
        private readonly autoBidRepository: Repository<AutoBid>,
        private readonly autoBidMapper: AutoBidMapper,
    ) { }

    async findAll(): Promise<AutoBidDto[]> {
        const autoBids = await this.autoBidRepository.find();
        return autoBids.map(autoBid => this.autoBidMapper.toDto(autoBid));
    }

    async findOne(id: number): Promise<AutoBidDto> {
        const autoBid = await this.autoBidRepository.findOneById(id);
        return this.autoBidMapper.toDto(autoBid);
    }

    async create(autoBidDto: AutoBidDto): Promise<AutoBidDto> {
        const autoBid = this.autoBidMapper.toEntity(autoBidDto);
        const createdAutoBid = await this.autoBidRepository.save(autoBid);
        return this.autoBidMapper.toDto(createdAutoBid);
    }

    async update(id: number, autoBidDto: AutoBidDto): Promise<AutoBidDto> {
        const existingAutoBid = await this.autoBidRepository.findOneById(id);
        if (!existingAutoBid) {
            return null;
        }
        const updatedAutoBid = Object.assign(existingAutoBid, autoBidDto);
        const savedAutoBid = await this.autoBidRepository.save(updatedAutoBid);
        return this.autoBidMapper.toDto(savedAutoBid);
    }

    async delete(id: number): Promise<void> {
        await this.autoBidRepository.delete(id);
    }

    async getMaximumBidForCurrentItem(antiquesId) {
        const maxBid = await this.autoBidRepository
            .createQueryBuilder("autoBid")
            .where("autoBid.antiques_id = :antiquesId", { antiquesId })
            .andWhere(qb => {
                const subQuery = qb
                    .subQuery()
                    .select("MAX(autoBidSub.maximumBidAmount)")
                    .from(AutoBid, "autoBidSub")
                    .where("autoBidSub.antiques_id = :antiquesId", { antiquesId })
                    .getQuery();
                return "autoBid.maximumBidAmount = (" + subQuery + ")";
            })
            .getOne();
        return maxBid ? maxBid : null;
    }

    async checkAutoBidExists(userId: number, antiquesId: number): Promise<boolean> {
        const autoBid = await this.autoBidRepository.findOne({
            where: { user_id: userId, antiques_id: antiquesId, isActive: true },
        });
        return !!autoBid;
    }

    async getCountOfBidsByUserId(userId: number): Promise<number> {
        const count = await this.autoBidRepository.count({ where: { user_id: userId } });
        return count || 0;
    }

    async updateMaximumBidByUserId(userId: number, maximumBid: number): Promise<void> {
        const autoBids = await this.autoBidRepository.find({ where: { user_id: userId } });
        autoBids.forEach(async (autoBid) => {
            autoBid.maximumBidAmount = maximumBid;
            await this.autoBidRepository.save(autoBid);
        });
    }

    async getAutoBidByUserAndAntique(userId: number, antiqueId: number): Promise<AutoBid | undefined> {
        return await this.autoBidRepository.findOne({
            where: {
                user_id: userId,
                antiques_id: antiqueId
            }
        });
    }
}
