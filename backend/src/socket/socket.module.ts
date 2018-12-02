import { Module } from '@nestjs/common';
import { AuthModule, UserModule, MessageModule, ChatModule } from 'src/modules';
import { ChatGateway } from './socket.gateway';

@Module({
    imports: [
        AuthModule,
        UserModule,
        MessageModule,
        ChatModule
    ],
    providers: [ChatGateway]
})
export class SocketModule { }
