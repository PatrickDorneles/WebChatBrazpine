import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entity/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { UserNotFoundError } from 'src/exceptions';

@Injectable()
export class ChatService {

    constructor(
        private readonly userService: UserService,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>
    ) { }

    public async getChatById(id: number) {
        return await this.chatRepository.findOne({ where: { id: id }, relations: ['users', 'messages'] })
    }

    public async getChatsByOneUser(userId: number): Promise<Chat[]> {
        const user: User | undefined = await this.userService.getUserById(userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const chats: Chat[] = await this.chatRepository.find({ relations: ['users', 'messages'] })

        const userChats = chats.filter(c => (c.users.find(u => u.id === userId) !== undefined))

        return userChats;
    }

    public async getChatByUsers(loggedUserId: number, friendUserId: number): Promise<Chat | undefined> {
        const loggedUser: User | undefined = await this.userService.getUserById(loggedUserId)

        if (!loggedUser) {
            throw new UserNotFoundError()
        }

        const friendUser: User | undefined = await this.userService.getUserById(friendUserId)

        if (!friendUser) {
            throw new UserNotFoundError()
        }

        const chats: Chat[] = await this.chatRepository.find({ relations: ['users', 'messages'] })

        const chatBetweenUsers = chats.find(c => (c.users.find(u => u.id === loggedUserId) !== undefined) && (c.users.find(u => u.id === friendUserId) !== undefined))

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

}