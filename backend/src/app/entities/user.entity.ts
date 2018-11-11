// @ts-ignore : 'Column' is declared but its value is never read.
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message, UserChat } from './'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  nickname: string

  @Column()
  password: string

  @Column()
  imageUrl: string

  @Column()
  birthday: Date

  @OneToMany(type => Message, message => message.user)
  messages: Message[]

  @OneToMany(type => UserChat, userChat => userChat.user)
  userChats: UserChat[]

}
