import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { User } from "src/modules/user/entity/user.entity";
import { Message } from "src/modules/message/entity/message.entity";


@Entity()
export class Chat {

    constructor(users: User[]) {
        this.users = users
    }

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Message, message => message.chat)
    messages: Message[]

    @ManyToMany(type => User, userChat => userChat.chats)
    users: User[]

}
