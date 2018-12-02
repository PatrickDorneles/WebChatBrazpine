import { Controller, Get, Headers, UseGuards } from "@nestjs/common";
import { ChatService } from "../service/chat.service";
import { ChatResponseDto } from "../dto/chat.dto";
import { Chat } from "../entity/chat.entity";
import { Message } from "src/modules/message/entity/message.entity";
import { AuthGuard } from "@nestjs/passport";
import { AuthUserHeaderDto } from "src/modules/auth/dto/auth.dto";

@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) { }

    @Get()
    @UseGuards(AuthGuard())
    async getChatsByAuthUser(@Headers() headers: AuthUserHeaderDto) {

        const userChats = await this.chatService.getChatsResponsesByUserToken(headers.authorization)

        return userChats

    }

}