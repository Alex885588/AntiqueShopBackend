import { Controller, Get, Request, Post, Body, Param, Put, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BidDto } from 'src/DTO/bid.DTO';
import { JwtRegularAuthGuard } from 'src/Guards/regular.auth.guard';
import { AntiquesService } from 'src/Services/antiques.service';
import { AuthService } from 'src/Services/auth.service';
import { AutoBidService } from 'src/Services/autoBid.service';
import { BidService } from 'src/Services/bid.service';

@Controller('businessLogic')
export class BusinessLogicController {
    constructor(
        private readonly antiquesService: AntiquesService,
        private readonly bidsService: BidService,
        private readonly userService: AuthService,
        private readonly autoBidService: AutoBidService) { }

    @Post()
    @UseGuards(JwtRegularAuthGuard)
    async getAllInformationOfItemById(@Request() req: any, @Body("itemId") itemId: number) {
        const userId = req.user.id
        const item = await this.antiquesService.findOne(itemId)
        const historyOfBidsForItem = await this.bidsService.getBidsForAntique(itemId)
        let winnerInfo
        let username
        winnerInfo = await this.bidsService.getHighestBid(itemId)
        username = await this.userService.getUsernameById(winnerInfo?.user_id)
        const autoBids = await this.autoBidService.checkAutoBidExists(userId, itemId)
        return {
            antiqueInfo: item,
            historyOfBids: historyOfBidsForItem,
            winnerInformation: winnerInfo,
            username: username,
            autoBids: autoBids
        }
    }
}
