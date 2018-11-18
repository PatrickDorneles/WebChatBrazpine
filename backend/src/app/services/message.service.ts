import { Repository, getRepository } from "typeorm";
import { Message } from "../entities";
import { MessageRequestDto } from "../dto/message.dto";
import { dependency } from "@foal/core";
import { UserService } from "./user.service";
import { UserNotFoundError } from "../errors";


export class MessageService {

    @dependency
    userService: UserService

    messageRepository: Repository<Message> = getRepository(Message)

    public async sendMessage(message: MessageRequestDto) {

        const user = await this.userService.getUserById(message.userId)

        if (!user) {
            throw new UserNotFoundError()
        }

    }

}
