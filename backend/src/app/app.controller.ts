import { UserController, ChatController } from './controllers'
import { controller } from '@foal/core';

export class AppController {
  subControllers = [
    controller('user', UserController),
    controller('chat', ChatController)
  ];
}
