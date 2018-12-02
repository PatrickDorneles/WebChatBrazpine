import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatService } from './service/chat.service';
import { UserService } from '../user/service/user.service';
import { Chat } from './entity/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        UserModule
    ],
    providers: [
        ChatService,
        UserService
    ],
    exports: [
        ChatService
    ]
})
export class ChatModule { }
