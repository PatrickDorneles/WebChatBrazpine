import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule, ChatModule, MessageModule, AuthModule } from './modules'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    ChatModule,
    MessageModule,
    AuthModule
  ]
})
export class AppModule { }
