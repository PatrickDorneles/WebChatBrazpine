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
    id: number
    name: string
    nickname: string
    imageUrl: string
    birthday: Date
}

export interface UserLoginRequestDto {
    nickname: string,
    password: string
}