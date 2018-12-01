import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule, ChatModule, MessageModule, AuthModule } from './modules'
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    ChatModule,
    MessageModule,
    AuthModule,
    SocketModule
  ]
})
export class AppModule { }
