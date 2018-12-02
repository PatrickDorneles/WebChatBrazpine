import { ContactUser } from "./contact.entity";
import { Message } from "./message.entity";

export interface Chat {
    contact: ContactUser
    messages: Message[]
}