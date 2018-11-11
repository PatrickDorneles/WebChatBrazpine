// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat, User } from './'

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string

  @Column()
  dateTime: Date

  @ManyToOne(type => User)
  user: User

  @ManyToOne(type => Chat)
  chat: Chat

}
