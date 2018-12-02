import { Injectable } from '@angular/core'
import { DEFAULT_API_URL } from './url.services'
import * as io from 'socket.io-client'

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private socket: SocketIOClient.Socket

    constructor() { }

    public connect(token: string): SocketIOClient.Socket {
        this.socket = io.connect(DEFAULT_API_URL)
        this.socket.emit('connect_user', token)
        return this.socket
    }

    public getSocket() {
        return this.socket
    }

}