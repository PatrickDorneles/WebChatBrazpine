import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { ChatService } from 'src/modules/chat/service/chat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entity/message.entity';
import { Repository } from 'typeorm';
import { Chat } from 'src/modules/chat/entity/chat.entity';
import { UserNotFoundError } from 'src/exceptions';
import { MessageRequestDto } from '../dto/message.dto';

@Injectable()
export class MessageService {

    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) { }

    public async sendMessage(messageReq: MessageRequestDto, loggedUserId: number) {

        let chat: Chat | undefined = await this.chatService.getChatByUsers(loggedUserId, messageReq.receiverUserId)

        const user = await this.userService.getUserById(loggedUserId);

        if (!user) {
            throw new UserNotFoundError()
        }

        if (!chat) {
            chat = await this.chatService.saveChat(loggedUserId, messageReq.receiverUserId)
        }

        const message: Message = new Message(messageReq.text, chat, user)

        const savedMessage: Message = await this.messageRepository.save(message)

        return savedMessage

    }


}