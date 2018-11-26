
import { Server } from 'http'
import { Socket } from 'socket.io'
import * as socketIo from 'socket.io'

import { SocketApp } from './app/socket'


export function socketInit(server: Server) {

    const io = socketIo(server)

    io.on('connect', (socket: Socket) => {
        new SocketApp(socket)
        socket.on('disconnect', () => {})        
    })

}

