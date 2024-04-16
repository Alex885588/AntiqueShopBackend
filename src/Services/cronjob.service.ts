import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Antiques } from 'src/Models/antiques';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BidService } from './bid.service';
import { BidStatus } from 'src/Enums/bid.status';
import { AntiquesService } from './antiques.service';
import { SocketGateway } from 'src/Socket/websocket.gateway';
import { EmailService } from './email.service';
import { AuthService } from './auth.service';
import { BidBusinessLogicService } from './bid.business.logic';

@Injectable()
export class CronjobService {
    constructor(
        @InjectRepository(Antiques)
        private readonly antiquesRepository: Repository<Antiques>,
        private readonly bidService: BidService,
        private readonly antiquesService: AntiquesService,
        private readonly webSocketService: SocketGateway,
        private readonly emailService: EmailService,
        private readonly userService: AuthService,
        private readonly businessLogic: BidBusinessLogicService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkExpiredBids() {
        const currentDateTime = new Date();
        const expiredAntiques = await this.antiquesRepository
            .createQueryBuilder('antique')
            .where('antique.biddingTimeLimit <= :currentDateTime', { currentDateTime })
            .andWhere('antique.biddingInProgress = :biddingInProgress', { biddingInProgress: true })
            .getMany();
        expiredAntiques.forEach(async (antique) => {
            const highestBid = await this.bidService.getHighestBid(antique.id)
            if (!highestBid) {
                await this.antiquesService.update({ id: antique.id, biddingInProgress: false })
                return
            }
            const winUser = await this.userService.getById(highestBid.user_id)
            let allParticipateIds = await this.bidService.getUsersByAntiquesId(antique.id)
            await this.businessLogic.sendEmailsToAllParticipates(allParticipateIds, antique.id, "BIDDING ALERT", `Bidding is over on ${antique.name}, ${winUser.username} wins, with final price ${antique.currentBid}`)
            await this.emailService.sendEmail(winUser.username, "YOU WIN IN AUCTION", `You win in auction of ${antique.name}, you need to pay ${antique.currentBid}$`)
            await this.bidService.update(highestBid.id, { bidStatus: BidStatus.Won })
            await this.antiquesService.update({ id: antique.id, biddingInProgress: false })
            this.webSocketService.sendMessageToUserByUserId(highestBid.user_id, 'notificationAboutWin', { itemName: antique.name, price: antique.currentBid })
        });
    }
}
