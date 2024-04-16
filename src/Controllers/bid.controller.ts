import { Controller, Get, Request, Post, Body, Param, Put, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BidDto } from 'src/DTO/bid.DTO';
import { JwtRegularAuthGuard } from 'src/Guards/regular.auth.guard';
import { BidService } from 'src/Services/bid.service';

@Controller('bids')
export class BidController {
    constructor(private readonly bidService: BidService) { }

    @Get()
    async findAll(): Promise<BidDto[]> {
        try {
            return await this.bidService.findAll();
        } catch (error) {
            console.error('Error occurred while fetching all bids:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<BidDto> {
        try {
            return await this.bidService.findOne(+id);
        } catch (error) {
            console.error(`Error occurred while fetching bid with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async create(@Body() bidDto: BidDto): Promise<BidDto> {
        try {
            return await this.bidService.create(bidDto);
        } catch (error) {
            console.error('Error occurred while creating bid:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() bidDto: BidDto): Promise<BidDto> {
        try {
            return await this.bidService.update(+id, bidDto);
        } catch (error) {
            console.error(`Error occurred while updating bid with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        try {
            await this.bidService.delete(+id);
        } catch (error) {
            console.error(`Error occurred while deleting bid with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/getHigestAntiqueBid')
    @UseGuards(JwtRegularAuthGuard)
    async getHigestAntiqueBid(@Body("antiquesId") antiquesId: number): Promise<BidDto> {
        try {
            return await this.bidService.getHighestBid(antiquesId);
        } catch (error) {
            console.error('Error occurred while creating bid:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:antiqueId/bidsList')
    @UseGuards(JwtRegularAuthGuard)
    async getBidsForAntique(@Param('antiqueId') antiqueId: number) {
        try {
            const bids = await this.bidService.getBidsForAntique(antiqueId);
            return bids;
        } catch (error) {
            console.error('Error occurred while fetching bids:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/getLastBidsByUserId')
    @UseGuards(JwtRegularAuthGuard)
    async getLastBidsByUserId(@Request() req: any) {
        try {
            const userId = req.user.id
            const bids = await this.bidService.getLastBidsByUserId(userId);
            return bids;
        } catch (error) {
            console.error('Error occurred while fetching bids:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
