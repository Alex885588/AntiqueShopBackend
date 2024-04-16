import { Controller, Request, Get, Post, Body, Param, Put, Delete, NotFoundException, Logger, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AutoBidDto } from 'src/DTO/autoBid.DTO';
import { JwtRegularAuthGuard } from 'src/Guards/regular.auth.guard';
import { AutoBidService } from 'src/Services/autoBid.service';
import { BidBusinessLogicService } from 'src/Services/bid.business.logic';

@Controller('autoBids')
export class AutoBidController {
    private readonly logger = new Logger(AutoBidController.name);

    constructor(private readonly autoBidService: AutoBidService, private readonly BidBusinessLogicService: BidBusinessLogicService) { }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<AutoBidDto> {
        try {
            const autoBid = await this.autoBidService.findOne(+id);
            if (!autoBid) {
                this.logger.warn(`AutoBid not found with ID: ${id}`);
                throw new NotFoundException('AutoBid not found');
            }
            this.logger.log(`Successfully fetched auto bid with ID: ${id}`);
            return autoBid;
        } catch (error) {
            this.logger.error(`Error while fetching auto bid with ID: ${id}: ${error.message}`);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('autoBidOn')
    @UseGuards(JwtRegularAuthGuard)
    async createAutoBid(@Request() req: any, @Body('antiquesId') antiquesId: number) {
        try {
            const userId = req.user.id
            const result = await this.BidBusinessLogicService.autoBidOn(antiquesId, userId)
            return result
        } catch (error) {
            this.logger.error(`Error while creating auto bid: ${error}`);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('autoBidOff')
    @UseGuards(JwtRegularAuthGuard)
    async deactivateAutoBid(@Request() req: any, @Body('antiquesId') antiquesId: number) {
        try {
            const userId = req.user.id
            const result = await this.BidBusinessLogicService.autoBidOff(antiquesId, userId)
            return result
        } catch (error) {
            this.logger.error(`Error while creating auto bid: ${error}`);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('userAutoBid')
    @UseGuards(JwtRegularAuthGuard)
    async getUserAutoBid(@Request() req: any, @Body('antiquesId') antiquesId: number) {
        try {
            const userId = req.user.id
            const result = await this.autoBidService.checkAutoBidExists(userId, antiquesId)
            return result
        } catch (error) {
            this.logger.error(`Error while fetching auto bid with ID : ${error.message}`);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
