import { Repository, getRepository } from "typeorm";
import { Message, User, Chat } from "../entities";
import { MessageRequestDto } from "../dto/message.dto";
import { dependency } from "@foal/core";
import { UserService } from "./user.service";
import { ChatService } from "./chat.service";
import { UserNotFoundError } from "../errors";


export class MessageService {

    @dependency
    userService: UserService

    @dependency
    chatService: ChatService

    messageRepository: Repository<Message> = getRepository(Message)

    public async sendMessage(messageReq: MessageRequestDto, loggedUserId: number) {

        let chat: Chat | undefined = await this.chatService.getChatByUsers(loggedUserId, messageReq.receiverUserId)

        const user = await this.userService.getUserById(loggedUserId);

        if(!user) {
            throw new UserNotFoundError()
        }

        if(!chat) {
            chat = await this.chatService.saveChat(loggedUserId, messageReq.receiverUserId)
        }

        const message: Message = new Message(messageReq.text, chat, user)

        const savedMessage: Message = await this.messageRepository.save(message)

        return savedMessage

    }

}
