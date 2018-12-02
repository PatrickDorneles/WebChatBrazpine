export interface Message {
    id: number
    userId: number
    text: string
}

export interface MessageWithContact {
    id: number
    userId: number
    contactId: number
    text: string
}