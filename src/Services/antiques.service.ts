import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Antiques } from 'src/Models/antiques';
import { AntiquesDTO } from 'src/DTO/antiques.DTO';
import { AntiquesMapper } from 'src/Mapper/antiques.mapper';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BidService } from './bid.service';
import { BidStatus } from 'src/Enums/bid.status';

@Injectable()
export class AntiquesService {
    constructor(
        @InjectRepository(Antiques)
        private readonly antiquesRepository: Repository<Antiques>,
        private readonly antiquesMapper: AntiquesMapper,
        private readonly bidService: BidService
    ) { }

    async findAll(): Promise<AntiquesDTO[]> {
        const antiques = await this.antiquesRepository.find();
        return antiques.map(antique => this.antiquesMapper.entityToDTO(antique));
    }

    async findOne(id: number): Promise<AntiquesDTO> {
        const antiques = await this.antiquesRepository.findOneById(id);
        return this.antiquesMapper.entityToDTO(antiques);
    }

    async paginatedListAndSearch(limit: number, offset: number, sortOrder: "ASC" | "DESC", name?: string): Promise<{ data: AntiquesDTO[], totalCount: number }> {
        const query = await this.antiquesRepository
            .createQueryBuilder('antiques')
        if (name) {
            const normalizedQuery = `%${name}%`;
            query.where("antiques.Description ILIKE :name OR antiques.Name ILIKE :name", {
                name: normalizedQuery
            })
        }
        query.orderBy('antiques.currentBid', sortOrder);
        query.take(limit);
        query.skip(offset);
        const [entities, totalCount] = await query.getManyAndCount();
        const antiquesDTOs = entities.map(antique => this.antiquesMapper.entityToDTO(antique));
        return { data: antiquesDTOs, totalCount };
    }

    async create(antiquesDTO: AntiquesDTO): Promise<AntiquesDTO> {
        const antiques = this.antiquesMapper.DTOToEntity(antiquesDTO);
        const createdAntiques = await this.antiquesRepository.save(antiques);
        return this.antiquesMapper.entityToDTO(createdAntiques);
    }

    async update(antiquesDTO: AntiquesDTO): Promise<AntiquesDTO> {
        const existingAntiques = await this.antiquesRepository.findOneById(antiquesDTO.id);
        if (!existingAntiques) {
            return null;
        }
        const updatedAntiques = Object.assign(existingAntiques, antiquesDTO);
        const savedAntiques = await this.antiquesRepository.save(updatedAntiques);
        return this.antiquesMapper.entityToDTO(savedAntiques);
    }

    async delete(id: number): Promise<void> {
        await this.antiquesRepository.delete(id);
    }

    // @Cron(CronExpression.EVERY_MINUTE)
    // async checkExpiredBids() {
    //     const currentDateTime = new Date();
    //     const expiredAntiques = await this.antiquesRepository
    //         .createQueryBuilder('antique')
    //         .where('antique.biddingTimeLimit <= :currentDateTime', { currentDateTime })
    //         .andWhere('antique.biddingInProgress = :biddingInProgress', { biddingInProgress: true })
    //         .getMany();
    //     expiredAntiques.forEach(async (antique) => {
    //         const highestBid = await this.bidService.getHighestBid(antique.id)
    //         await this.bidService.update(highestBid.id, { bidStatus: BidStatus.Won })
    //         this.update({ id: antique.id, biddingInProgress: false })
    //     });
    // }
}
