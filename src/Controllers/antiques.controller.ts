import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, NotFoundException, BadRequestException, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AntiquesService } from 'src/Services/antiques.service';
import { AntiquesDTO } from 'src/DTO/antiques.DTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { AWService } from 'src/Services/aws.service';
import { JwtRegularAuthGuard } from 'src/Guards/regular.auth.guard';
import { JwtAdminAuthGuard } from 'src/Guards/admin.auth.guard';

@Controller('antiques')
export class AntiquesController {
    constructor(private readonly antiquesService: AntiquesService, private readonly awsService: AWService) { }

    @Get(':id')
    @UseGuards(JwtRegularAuthGuard)
    async findOne(@Param('id') id: number): Promise<AntiquesDTO> {
        try {
            return await this.antiquesService.findOne(id);
        } catch (error) {
            console.error(`Error occurred while fetching antique with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('paginatedListAndSearch')
    async paginatedList(
        @Body('limit') limit: number,
        @Body('offset') offset: number,
        @Body('sortOrder') sortOrder: 'ASC' | 'DESC',
        @Body('name') name?: string,
    ): Promise<{ data: AntiquesDTO[], totalCount: number }> {
        try {
            return this.antiquesService.paginatedListAndSearch(limit, offset, sortOrder, name);
        } catch (error) {
            console.error('Error occurred while fetching paginated list of antiques:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @UseGuards(JwtRegularAuthGuard, JwtAdminAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async create(
        @Body("name") name: string,
        @Body("description") description: string,
        @Body("currentBid") currentBid: number,
        @Body("biddingTimeLimit") biddingTimeLimit: Date,
        @UploadedFile("file") file: Express.Multer.File
    ): Promise<AntiquesDTO> {
        try {
            if (!name || !description || !currentBid || !biddingTimeLimit || !file) {
                throw "Incomplete data provided";
            }
            if (currentBid < 0) {
                throw "Current Bid must be a positive number"
            }
            const icon = await this.awsService.uploadIcon(file);
            const createdAntique = await this.antiquesService.create({
                name,
                description,
                currentBid,
                biddingTimeLimit,
                antiquesImg: JSON.stringify(icon)
            });
            return createdAntique;
        } catch (error) {
            console.error('Error occurred while creating antique:', error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @UseGuards(JwtRegularAuthGuard, JwtAdminAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async update(
        @Param('id') id: number,
        @Body("name") name: string,
        @Body("description") description: string,
        @Body("currentBid") currentBid: number,
        @Body("biddingTimeLimit") biddingTimeLimit: Date,
        @UploadedFile("file") file: Express.Multer.File): Promise<AntiquesDTO> {
        try {
            if (currentBid < 0) {
                throw "Current Bid Must Be A Positive Number"
            }
            let icon
            if (file) {
                icon = await this.awsService.uploadIcon(file);
            }
            const updatedAntique = await this.antiquesService.update(
                {
                    id: +id,
                    name,
                    description,
                    currentBid,
                    biddingTimeLimit,
                    antiquesImg: JSON.stringify(icon)
                }
            );
            if (!updatedAntique) {
                throw new NotFoundException("Antique not found");
            }
            return updatedAntique;
        } catch (error) {
            console.error(`Error occurred while updating antique with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @UseGuards(JwtRegularAuthGuard, JwtAdminAuthGuard)
    async delete(@Param('id') id: number): Promise<void> {
        try {
            await this.antiquesService.delete(id);
        } catch (error) {
            console.error(`Error occurred while deleting antique with ID ${id}:`, error);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('isTokenValid')
    @UseGuards(JwtRegularAuthGuard)
    async isTokenValid(): Promise<boolean> {
        return true;
    }


}
