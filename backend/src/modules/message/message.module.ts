import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/service/user.service';
import { ChatService } from '../chat/service/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { MessageService } from './service/message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        ChatModule,
        UserModule
    ],
    providers: [
        UserService,
        ChatService,
        MessageService
    ],
    exports: [
        MessageService
    ]
})
export class MessageModule { }
