import { UserChat } from "../entities";

export interface UserRequestDto {
    name: string
    nickname: string
    password: string
    imageUrl: string
    birthday: Date
}

export interface UserResponseDto {
    name: string
    nickname: string
    imageUrl: string
    birthday: Date
    userChats: UserChat[]
}