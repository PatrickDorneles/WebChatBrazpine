import { Context, Get, HttpResponseOK, dependency, HttpResponseNotFound, Post, HttpResponseBadRequest, HttpResponseCreated, HttpResponseInternalServerError, HttpResponse } from '@foal/core';
import { UserService } from '../services';
import { User } from '../entities';
import { UserRequestDto, UserResponseDto, UserLoginRequestDto } from '../dto';
import { InvalidInputError } from '../errors/invalid-input.error';

export class UserController {

  @dependency
  userServices: UserService

  @Get('/:id')
  async getUserById(ctx: Context): Promise<HttpResponse> {
    const id: number = ctx.request.params.id

    const user: User | undefined = await this.userServices.getUserById(id)

    if (!user) {
      return new HttpResponseNotFound({ message: 'User with requested id was not found' })
    }

    return new HttpResponseOK({ user })

  }

  @Post('/signin')
  async signInUser(ctx: Context): Promise<HttpResponse> {
    const userToLogin: UserLoginRequestDto = ctx.request.body

    const token = this.userServices.loginUser(userToLogin)

    return new HttpResponseOK({ token })

  }

  @Post('/')
  async registerUser(ctx: Context): Promise<HttpResponse> {

    const userToRegister: UserRequestDto = ctx.request.body

    const userWithSameNick: User | undefined = await this.userServices.getUserByNickname(userToRegister.nickname)

    if (userWithSameNick) {
      return new HttpResponseBadRequest({ message: 'This nickname is already in use' })
    }

    try {
      const user: User = await this.userServices.registerUser(userToRegister)

      const savedUser: UserResponseDto = {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        imageUrl: user.imageUrl,
        birthday: user.birthday
      }

      return new HttpResponseCreated({ savedUser })
    } catch (error) {
      if (error instanceof InvalidInputError) {
        return new HttpResponseBadRequest({ message: error.message })
      }
      return new HttpResponseInternalServerError({ message: error.message })
    }

  }

}
