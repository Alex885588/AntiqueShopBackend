import { Controller, Post, Body, HttpException, HttpStatus, Put, UseGuards, Request, Get, Param } from '@nestjs/common';
import { JwtRegularAuthGuard } from '../Guards/regular.auth.guard';
import { AuthService } from '../Services/auth.service';
import * as bcrypt from "bcrypt";
import { UserRole } from 'src/Enums/user.role';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Get()
    @UseGuards(JwtRegularAuthGuard)
    async getById(@Request() req: any) {
        try {
            const userId = req.user.id
            const user = await this.authService.getById(userId)
            return user
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('signin')
    async signIn(@Body('username') username: string, @Body('password') password: string) {
        try {
            const token = await this.authService.signIn(username, password);
            return token;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @UseGuards(JwtRegularAuthGuard)
    async updateUser(@Request() req: any, @Body('autoBidBalance') autoBidBalance: number, @Body('notificationParcentage') notificationParcentage: number) {
        try {
            const id = req.user.id
            if (autoBidBalance <= 0 || notificationParcentage <= 0)
                throw new Error("Current Bid Must Be A Positive Number")
            const updatedUser = await this.authService.update(
                {
                    id,
                    autoBidBalance: autoBidBalance,
                    notificationParcentage: notificationParcentage
                }
            );
            return updatedUser;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':userId/username')
    @UseGuards(JwtRegularAuthGuard)
    async getUsernameById(@Param('userId') userId: string): Promise<string> {
        return this.authService.getUsernameById(Number(userId));
    }

    @Post("/register")
    async createUser(
        @Body("username") username: string,
        @Body("password") password: string,
    ): Promise<any> {
        try {
            const isUserExists =
                await this.authService.isUsernameExists(username);
            if (isUserExists) {
                throw new Error("user exists");
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const toReturn = await this.authService.create({ username: username, password: hashPassword, userStatus: UserRole.Regular })
            return { user: toReturn, success: true }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
