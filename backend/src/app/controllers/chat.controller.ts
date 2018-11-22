import { Context, Get, HttpResponseOK, Post } from '@foal/core';

export class ChatController {

    @Post('/send')
    private sendMessage(ctx: Context) {
        const token = ctx.request.headers.authorization
    }

}
