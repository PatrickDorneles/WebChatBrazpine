export interface ConnectedUser {
    id: number
    socket: SocketIO.Socket
}

export interface MessageRequest {
    token: string
    contactId: number
    message: string
}

export interface ContactUser {
    id: number
    nickname: string
    name: string
    imageUrl: string
}
export interface MessageResponse {
    message: string
    userId: number
    contactId?: number
}

