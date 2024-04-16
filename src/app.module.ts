import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Antiques } from './Models/antiques';
import { AuthController } from './Controllers/auth.controller';
import { AntiquesController } from './Controllers/antiques.controller';
import { AntiquesService } from './Services/antiques.service';
import { AuthService } from './Services/auth.service';
import { AWService } from './Services/aws.service';
import { AntiquesMapper } from './Mapper/antiques.mapper';
import { SocketGateway } from './Socket/websocket.gateway';
import { AutoBid } from './Models/autoBid';
import { Bid } from './Models/bid';
import { AutoBidController } from './Controllers/autoBid.controller';
import { BidController } from './Controllers/bid.controller';
import { AutoBidService } from './Services/autoBid.service';
import { BidService } from './Services/bid.service';
import { AutoBidMapper } from './Mapper/autoBid.mapper';
import { BidMapper } from './Mapper/bid.mapper';
import { UserMapper } from './Mapper/user.mapper';
import { User } from './Models/user';
import { BidBusinessLogicService } from './Services/bid.business.logic';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './Services/cronjob.service';
import { EmailService } from './Services/email.service';
import { BusinessLogicController } from './Controllers/business.logic.controller';

@Module({
  imports: [ConfigModule.forRoot(),
  ScheduleModule.forRoot(),
  TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      User,
      Antiques,
      AutoBid,
      Bid
    ],
    synchronize: true
  }),
  TypeOrmModule.forFeature([
    User,
    Antiques,
    AutoBid,
    Bid
  ]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES }
  })],
  controllers: [AntiquesController, AuthController, AutoBidController, BidController, BusinessLogicController],
  providers: [CronjobService, EmailService, AntiquesService, AuthService, AWService, AntiquesMapper, AntiquesMapper, BidBusinessLogicService, SocketGateway, AutoBidService, BidService, AutoBidMapper, BidMapper, UserMapper]
})
export class AppModule { }
