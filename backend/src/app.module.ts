import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule, ChatModule, MessageModule, AuthModule } from './modules'

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ChatModule, MessageModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
