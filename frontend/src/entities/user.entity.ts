export interface UserSignUp {
    name: string
    nickname: string
    password: string
    birthday: Date
    isAdmin: boolean
    imageUrl: ''
}

export interface ReceivedSignUpUser {
    id: number
    name: string
    nickname: string
    imageUrl: string
    birthday: Date
}