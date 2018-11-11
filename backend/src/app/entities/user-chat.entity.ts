// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Chat, User } from './'


@Entity()
export class UserChat {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Chat)
  chat: Chat

  @ManyToOne(type => User)
  user: User

}
