import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    @WebSocketServer() server;

    handleConnection(socket: Socket, data) {

    }

    handleDisconnect(socket: Socket) {
    }



    @SubscribeMessage('message')
    onEvent(client: Socket, data) {
    }
}