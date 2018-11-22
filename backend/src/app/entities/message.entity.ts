// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat, User } from './'

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
