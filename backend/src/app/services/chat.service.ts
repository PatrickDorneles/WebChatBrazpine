import { getRepository, Repository } from 'typeorm'
import { Chat, User } from '../entities'
import { dependency } from '@foal/core';
import { UserService } from './user.service';
import { UserNotFoundError } from '../errors';

export class ChatService {

    private chatRepository: Repository<Chat> = getRepository(Chat)

    @dependency
    private userService: UserService


    public async getChatsByOneUser(userId: number): Promise<Chat[]> {
        const user: User | undefined = await this.userService.getUserById(userId)

        if(!user) {
            throw new UserNotFoundError()
        }

        const chats: Chat[] = user.chats;

        return chats;
    }

    public async getChatByUsers(loggedUserId: number, friendUserId: number): Promise<Chat | undefined> {
        const loggedUser: User | undefined = await this.userService.getUserById(loggedUserId)

        if(!loggedUser) {
            throw new UserNotFoundError()
        }

        const friendUser: User | undefined = await this.userService.getUserById(friendUserId)
        
        if(!friendUser) {
            throw new UserNotFoundError()
        }
        
        const loggedUserChats: Chat[] = loggedUser.chats

        const chatBetweenUsers: Chat | undefined = loggedUserChats.find(c => c.users.find(u => u === friendUser) !== undefined)

        return chatBetweenUsers

    }

    public async saveChat(loggedUserId: number, friendUserId: number) {
        
        const loggedUser: User | undefined = await this.userService.getUserById(loggedUserId)

        if(!loggedUser) {
            throw new UserNotFoundError()
        }

        const friendUser: User | undefined = await this.userService.getUserById(friendUserId)
        
        if(!friendUser) {
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
