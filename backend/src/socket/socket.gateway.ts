import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { UserService } from 'src/modules/user/service/user.service';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { ConnectedUser, MessageRequest, ContactUser, MessageResponse } from './interfaces/socket.interfaces';
import { User } from 'src/modules/user/entity/user.entity';
import { Chat } from 'src/modules/chat/entity/chat.entity';
import { MessageService } from 'src/modules/message/service/message.service';
import { Message } from 'src/modules/message/entity/message.entity';
import { MessageRequestDto } from 'src/modules/message/dto/message.dto';
import { ChatService } from 'src/modules/chat/service/chat.service';
import { ChatResponseDto } from 'src/modules/chat/dto/chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {

    connectedUsers: ConnectedUser[]

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly messageService: MessageService,
        private readonly chatService: ChatService) {
        this.connectedUsers = []
    }

    @WebSocketServer() server;

    handleDisconnect(socket: Socket) {
        const userToDisconnet = this.connectedUsers.find(u => u.socket.id === socket.id)
        this.connectedUsers = this.connectedUsers.filter(u => u !== userToDisconnet)
    }


    @SubscribeMessage('connect_user')
    async connectUser(socket: Socket, token: string) {
        try {
            const user: User = await this.authService.getUserByToken(token)

            const connectedUser: ConnectedUser = { id: user.id, socket }

            this.connectedUsers.push(connectedUser)



        } catch (error) {
            socket.emit('connection-error', 'Something went wrong')
        }
    }

    @SubscribeMessage('message')
    async onEvent(client: Socket, messageRequest: MessageRequest) {
        const user: User = await this.authService.getUserByToken(messageRequest.token)
        const contactUser: User = await this.userService.getUserById(messageRequest.contactId)

        const chatWithContact: Chat | undefined = await this.chatService.getChatByUsers(user.id, contactUser.id)

        const messageReq: MessageRequestDto = {
            text: messageRequest.message,
            receiverUserId: contactUser.id
        }

        const message: Message = await this.messageService.sendMessage(messageReq, user.id)

        const messageResponse: MessageResponse = {
            message: message.text,
            userId: user.id
        }

        const contactUserConnected: ConnectedUser | undefined = this.connectedUsers.find(u => u.id === contactUser.id)

        if (!chatWithContact) {

            const chatResponseToUser: ChatResponseDto = {
                contact: {
                    id: contactUser.id,
                    name: contactUser.name,
                    nickname: contactUser.nickname,
                    imageUrl: contactUser.imageUrl
                },
                messages: [messageResponse]
            }

            client.emit('new_chat', chatResponseToUser)

            if (contactUserConnected) {

                const chatResponseToContact: ChatResponseDto = {
                    contact: {
                        id: user.id,
                        name: user.name,
                        nickname: user.nickname,
                        imageUrl: user.imageUrl
                    },
                    messages: [messageResponse]
                }


                contactUserConnected.socket.emit('new_chat', chatResponseToContact)
            }

        } else {

            messageResponse.contactId = contactUser.id;

            client.emit('new_message', messageResponse)

            if (contactUserConnected) {

                const messageResponseToContact: MessageResponse = {
                    message: message.text,
                    userId: user.id,
                    contactId: user.id
                }

                contactUserConnected.socket.emit('new_message', messageResponseToContact)

            }

        }




    }
}