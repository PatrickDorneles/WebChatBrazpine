// @ts-ignore : 'Column' is declared but its value is never read.
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message, UserChat } from './'

@Entity()
export class Chat {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Message, message => message.chat)
  messages: Message[]

  @OneToMany(type => UserChat, userChat => userChat.chat)
  userChats: UserChat[]

}
