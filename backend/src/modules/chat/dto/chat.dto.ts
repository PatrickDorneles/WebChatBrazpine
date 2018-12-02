import { ContactUser, MessageResponse } from "src/socket/interfaces/socket.interfaces";

export interface ChatResponseDto {
    contact: ContactUser
    messages: MessageResponse[]
}