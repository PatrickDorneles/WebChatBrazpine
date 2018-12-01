import { Entity, Column, PrimaryGeneratedColumn, JoinTable, OneToMany, ManyToMany } from 'typeorm';
import { Message } from '../../message/entity/message.entity';
import { Chat } from '../../chat/entity/chat.entity';

@Entity()
export class User {

    constructor(name: string, nickname: string, password: string, imageUrl: string, birthday: Date) {
        this.name = name
        this.nickname = nickname
        this.password = password
        this.imageUrl = imageUrl
        this.birthday = birthday
    }

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

    @JoinTable()
    @OneToMany(type => Message, message => message.user)
    messages: Message[]

    @JoinTable()
    @ManyToMany(type => Chat, chat => chat.users)
    chats: Chat[]

    @Column()
    isAdmin: boolean

    public setAdmin(): void {
        this.isAdmin = true
    }

    public setCommon(): void {
        this.isAdmin = false
    }


}
