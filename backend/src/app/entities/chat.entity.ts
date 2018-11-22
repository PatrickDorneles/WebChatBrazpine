// @ts-ignore : 'Column' is declared but its value is never read.
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Message } from './'
import { User } from './user.entity';

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
