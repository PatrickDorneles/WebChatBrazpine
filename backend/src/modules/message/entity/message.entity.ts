import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Chat } from "src/modules/chat/entity/chat.entity";
import { User } from "src/modules/user/entity/user.entity";

@Entity()
export class Message {


    constructor(text: string, chat: Chat, user: User) {
        this.text = text
        this.chat = chat
        this.user = user
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string

    @CreateDateColumn()
    dateTime: Date

    @ManyToOne(type => User, user => user.messages)
    user: User

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat

}