import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { BidBusinessLogicService } from 'src/Services/bid.business.logic';
import { AuthService } from 'src/Services/auth.service';
import { bidInParcentage } from 'src/Utils/utils';
import { AutoBidService } from 'src/Services/autoBid.service';
import { Payload } from 'src/Interface/payload.interface';


@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly connectedClients: Map<string, string>;

    constructor(
        private readonly businessLogicService: BidBusinessLogicService,
        private readonly userService: AuthService,
        private readonly autoBidService: AutoBidService,
    ) {
        this.connectedClients = new Map<string, string>();
    }

    async handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
        const token = client.handshake.query.token;
        const tokenString = typeof token === 'string' ? token : Array.isArray(token) ? token[0] : null;
        if (!tokenString) {
            console.log(`No token provided for client: ${client.id}`);
            client.disconnect();
            return;
        }
        const isValidToken = await this.verifyToken(tokenString, 'my-secret-key');
        if (!isValidToken) {
            console.log(`Invalid token provided for client: ${client.id}`);
            client.disconnect();   
            return;         
        }
        this.connectedClients.set(client.id, tokenString);
        console.log(`Token saved for client: ${client.id}`);        
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }

    @SubscribeMessage('updateAntiques')
    async handleUpdateUser(client: Socket, payload: Payload) {
        try {
            const token = this.connectedClients.get(client.id);
            const decodedToken = jwt.decode(token) as jwt.JwtPayload;
            const result = await this.businessLogicService.bid(decodedToken.id, payload.id, payload.currentBid)
            const user = await this.userService.getById(result.user_id)
            const maxBidOnItemByUser = await this.autoBidService.getAutoBidByUserAndAntique(result.user_id, payload.id)
            let isNotifNeeded = null
            if (maxBidOnItemByUser) {
                isNotifNeeded = bidInParcentage(result.currentItem.currentBid, user.notificationParcentage, maxBidOnItemByUser.maximumBidAmount)
            }
            this.server.emit('antiqueUpdated', { message: 'Antiques data updated successfully', value: result.currentItem.currentBid, item_id: payload.id });
            this.sendMessageToUserByUserId(result.user_id, 'antiquesWin', { notification: isNotifNeeded })
        } catch (error) {
            this.sendMessageToUserByUserId(error.user_id, 'antiquesUpdateError', { message: error.message })
        }
    }

    sendMessageToUserByUserId(user_id: number, event: string, data: any) {
        for (const [clientId, clientToken] of this.connectedClients) {
            const decodedToken = jwt.decode(clientToken) as jwt.JwtPayload;
            if (decodedToken.id === user_id) {
                const clientSocketId = clientId;
                const client = this.server.sockets.sockets.get(clientSocketId);
                if (client) {
                    client.emit(event, data);
                    return;
                }
            }
        }
        console.log(`User with ID ${user_id} not found.`);
    }

    async verifyToken(token: string, secretOrPublicKey: string): Promise<boolean> {
        try {
            jwt.verify(token, secretOrPublicKey);
            return true;
        } catch (error) {
            return false;
        }
    }
}
