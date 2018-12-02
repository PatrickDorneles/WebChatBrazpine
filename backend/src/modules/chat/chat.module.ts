import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatService } from './service/chat.service';
import { UserService } from '../user/service/user.service';
import { Chat } from './entity/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controller/chat.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [ChatController],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([Chat]),
        UserModule,
        AuthModule
    ],
    providers: [
        ChatService,
    ],
    exports: [
        ChatService
    ]
})
export class ChatModule { }
