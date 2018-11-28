import { UserController } from './controllers'
import { controller, Options, Context, HttpResponseOK, Hook } from '@foal/core';

@Hook(() => (ctx, services, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
})

export class AppController {
  subControllers = [
    controller('/api/user', UserController)
  ];

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseOK()
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
  }

}
