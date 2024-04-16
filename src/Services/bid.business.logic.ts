import { Injectable } from '@nestjs/common';
import { AntiquesService } from './antiques.service';
import { AutoBidService } from './autoBid.service';
import { AuthService } from './auth.service';
import { BidService } from './bid.service';
import { EmailService } from './email.service';

@Injectable()
export class BidBusinessLogicService {
    constructor(
        private readonly antiquesService: AntiquesService,
        private readonly autoBidService: AutoBidService,
        private readonly bidServcice: BidService,
        private readonly userSrvice: AuthService,
        private readonly emailSrvice: EmailService,
    ) { }

    async bid(userId: number, itemId: number, bid: number) {
        const item = await this.antiquesService.findOne(itemId)
        if (item.currentBid > bid) {
            throw { message: 'Your balance is not enough', user_id: userId };
        }
        const listOfUsersPartInAuction = await this.bidServcice.getUsersByAntiquesId(itemId)
        let currentItem = await this.antiquesService.update({ id: itemId, currentBid: bid })
        await this.bidServcice.create({ user_id: userId, antiques_id: itemId, bidAmount: bid })
        const activeAutoBids = await this.autoBidService.getMaximumBidForCurrentItem(itemId)
        if (activeAutoBids === null) {
            await this.sendEmailsToAllParticipates(listOfUsersPartInAuction, itemId, "New Bidding", "There is a new bidding on")
            return { currentItem, user_id: userId }
        }
        if (activeAutoBids.user_id === userId) {
            await this.sendEmailsToAllParticipates(listOfUsersPartInAuction, itemId, "New Bidding", "There is a new bidding on")
            return { currentItem, user_id: userId }
        }

        if (activeAutoBids.maximumBidAmount > bid && activeAutoBids.isActive) {
            let currentItem = await this.antiquesService.update({ id: itemId, currentBid: bid + 1 })
            await this.bidServcice.create({ user_id: activeAutoBids.user_id, antiques_id: itemId, bidAmount: bid + 1 })
            await this.sendEmailsToAllParticipates(listOfUsersPartInAuction, itemId, "New Bidding", "There is a new bidding on")
            return { currentItem, user_id: activeAutoBids.user_id, maxBid: activeAutoBids.maximumBidAmount }
        }
        await this.sendEmailsToAllParticipates(listOfUsersPartInAuction, itemId, "New Bidding", "There is a new bidding")
        return { currentItem, user_id: userId }
    }

    async autoBidOn(itemId: number, userId: number) {
        const user = await this.userSrvice.getById(userId)
        const item = await this.antiquesService.findOne(itemId)
        if (!user.autoBidBalance) {
            throw { message: 'Your Balance is not enough for auto bidding', use_id: userId }
        }
        const isUserHaveAutoBidAndCount = await this.autoBidService.getCountOfBidsByUserId(userId)
        let balanceForSingleItem = user.autoBidBalance / (isUserHaveAutoBidAndCount + 1);
        const activeAutoBids = await this.autoBidService.getMaximumBidForCurrentItem(itemId)
        if (activeAutoBids && activeAutoBids.maximumBidAmount > balanceForSingleItem) {
            throw { message: 'Your Balance is not enough for auto bidding', use_id: userId }
        }
        const maximumBidOfUser = await this.bidServcice.getMaxBidAmountByUserId(userId)
        balanceForSingleItem = Math.floor(balanceForSingleItem)
        if (maximumBidOfUser && maximumBidOfUser > balanceForSingleItem) {
            throw { message: 'Your Balance is not enough for auto bidding', use_id: userId }
        }
        if (activeAutoBids && item.currentBid < activeAutoBids.maximumBidAmount) {
            const listOfUsersPartInAuction = await this.bidServcice.getUsersByAntiquesId(itemId)
            await this.sendEmailsToAllParticipates(listOfUsersPartInAuction, itemId, "New Bidding", "There is a new bidding on")
            await this.antiquesService.update({ id: itemId, currentBid: activeAutoBids.maximumBidAmount + 1 })
            await this.bidServcice.create({ user_id: userId, antiques_id: itemId, bidAmount: activeAutoBids.maximumBidAmount + 1 })
        }
        await this.autoBidService.updateMaximumBidByUserId(userId, balanceForSingleItem)
        await this.autoBidService.create({ user_id: userId, antiques_id: itemId, maximumBidAmount: balanceForSingleItem })
        return true
    }

    async autoBidOff(itemId: number, userId: number) {
        const autoBid = await this.autoBidService.getAutoBidByUserAndAntique(userId, itemId)
        await this.autoBidService.update(autoBid.id, { isActive: false })
        return true
    }

    async sendEmailsToAllParticipates(userIds: number[], itemId: number, subject: string, body: string) {
        const currentItem = await this.antiquesService.findOne(itemId)
        let usernames = await this.getUsernamesByUserIdForEmail(userIds)
        usernames.map(async (username: string) => {
            await this.emailSrvice.sendEmail(username, subject, `${body} ${currentItem.name}`)
        })
    }

    async getUsernamesByUserIdForEmail(userIds: number[]) {
        if (!Array.isArray(userIds))
            userIds = [userIds]
        let usernames: string[] = []
        for (let i = 0; i < userIds.length; i++) {
            let username = await this.userSrvice.getUsernameById(userIds[i])
            usernames.push(username)
        }
        return usernames
    }
}
