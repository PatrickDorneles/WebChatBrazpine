import { Socket } from "socket.io";
import { ISocketMessageRequest } from './'
import { dependency } from "@foal/core";
import { UserService, MessageService } from "../services";
import { MessageRequestDto } from '../dto'
import { ITokenPayload } from  '../utils'


export class SocketApp {

    @dependency
    userService: UserService

    @dependency
    messageService: MessageService

    socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
        this.socket.on('message', this.handleMessage)
    }


    async handleMessage(message: ISocketMessageRequest) {
        const userPayload: ITokenPayload | undefined = this.userService.getPayloadFromToken(message.token)
        
        if(!userPayload) {
            this.socket.emit('error', { message: 'Token recebido é invalido' } )
            return;
        }

        const messageRequest: MessageRequestDto = {
            text: message.text,
            receiverUserId: message.receiverId
        } 

        this.messageService.sendMessage(messageRequest, userPayload.id)

    }



}
