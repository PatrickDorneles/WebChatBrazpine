import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entity/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { UserNotFoundError } from 'src/exceptions';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { ChatResponseDto } from '../dto/chat.dto';
import { MessageResponse } from 'src/socket/interfaces/socket.interfaces';
import { Message } from 'src/modules/message/entity/message.entity';

@Injectable()
export class ChatService {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>
    ) { }

    public async getChatById(id: number) {
        return await this.chatRepository.findOne({ where: { id: id }, relations: ['users', 'messages'] })
    }

    public async getChatsResponsesByUserToken(token: string) {
        const user: User = await this.authService.getUserByToken(token)
        const userChats: Chat[] = await this.getChatsByOneUser(user.id)
        return this.translateFromChatToChatResponse(userChats, user)
    }

    public async getChatsByOneUser(userId: number): Promise<Chat[]> {
        const user: User | undefined = await this.userService.getUserById(userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const chats: Chat[] = await this.chatRepository.find({ relations: ['users', 'messages', 'messages.user'] })

        const userChats = chats.filter(c => (c.users.find(u => u.id === userId) !== undefined))

        return userChats;
    }

    public async getChatByUsers(loggedUserId: number, friendUserId: number): Promise<Chat | undefined> {

        const chats: Chat[] = await this.chatRepository.find({ relations: ['users', 'messages'] })

        const chatBetweenUsers: Chat | undefined = chats.find(c => (c.users.find(u => u.id === loggedUserId) !== undefined) && (c.users.find(u => u.id === friendUserId) !== undefined))

        return chatBetweenUsers

    }

    public async saveChat(loggedUserId: number, friendUserId: number) {

        const loggedUser: User | undefined = await this.userService.getUserById(loggedUserId)

        if (!loggedUser) {
            throw new UserNotFoundError()
        }

        const friendUser: User | undefined = await this.userService.getUserById(friendUserId)

        if (!friendUser) {
            throw new UserNotFoundError()
        }

        const chat = new Chat([
            loggedUser,
            friendUser
        ])

        const savedChat: Chat = await this.chatRepository.save(chat)

        return savedChat

    }

    private translateFromChatToChatResponse(chats: Chat[], user: User) {
        return chats.map((c: Chat): ChatResponseDto => {
            const contact = c.users.find(u => u.id !== user.id)


            const messages: Message[] = c.messages.sort((a, b) => {
                return a.dateTime.getTime() - b.dateTime.getTime()
            })

            const messagesResponse: MessageResponse[] = messages.map((m: Message): MessageResponse => {
                return { userId: m.user.id, message: m.text }
            })

            return {
                contact: { id: contact.id, name: contact.name, nickname: contact.nickname, imageUrl: contact.imageUrl },
                messages: messagesResponse
            }
        })
    }

}