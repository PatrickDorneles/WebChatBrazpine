export interface AuthenticatedUser {
    id: number
    name: string
    nickname: string
    imageUrl: string
    birthday: Date
    isAdmin: boolean
}

export interface UserSignIn {
    nickname: string
    password: string
}

export interface TokenSignInReceiver {
    token: string
}

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