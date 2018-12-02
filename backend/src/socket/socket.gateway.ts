import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { UserService } from 'src/modules/user/service/user.service';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { ConnectedUser, MessageRequest, ContactUser } from './interfaces/socket.interfaces';
import { User } from 'src/modules/user/entity/user.entity';
import { Chat } from 'src/modules/chat/entity/chat.entity';
import { MessageService } from 'src/modules/message/service/message.service';
import { Message } from 'src/modules/message/entity/message.entity';
import { MessageRequestDto } from 'src/modules/message/dto/message.dto';
import { ChatService } from 'src/modules/chat/service/chat.service';

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

    @SubscribeMessage('search_user')
    async searchUser(socket: Socket, searchParams: { search: string, token: string }) {
        let usersFound: User[] = await this.userService.searchUser(searchParams.search)
        const connectedUser = await this.authService.getUserByToken(searchParams.token)
        usersFound = usersFound.filter(u => u.id !== connectedUser.id)

        const contactsFound = usersFound.map((u): ContactUser => {
            return {
                id: u.id,
                name: u.name,
                nickname: u.nickname,
                imageUrl: u.imageUrl
            }
        })

        socket.emit('search_result', contactsFound)
    }


    @SubscribeMessage('message')
    async onEvent(client: Socket, messageRequest: MessageRequest) {
        const user: User = await this.authService.getUserByToken(messageRequest.token)
        const contactUser: User = await this.userService.getUserById(messageRequest.contactId)

        const chatWithContact: Chat | undefined = user.chats.find(c => c.users.find(u => u.id === contactUser.id) !== undefined)

        if (!chatWithContact) {
            const messageReq: MessageRequestDto = {
                text: messageRequest.message,
                receiverUserId: contactUser.id
            }
            const message: Message = await this.messageService.sendMessage(messageReq, user.id)

        } else {

        }




    }
}