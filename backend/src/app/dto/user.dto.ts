import { Chat } from "../entities";

export interface UserRequestDto {
    name: string
    nickname: string
    password: string
    imageUrl: string
    birthday: Date
    isAdmin?: boolean
}

export interface UserResponseDto {
    name: string
    nickname: string
    imageUrl: string
    birthday: Date
    chats: Chat[]
}