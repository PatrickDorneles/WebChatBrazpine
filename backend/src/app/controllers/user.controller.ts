import { Context, Get, HttpResponseOK, dependency, HttpResponseNotFound, Post, HttpResponseBadRequest, HttpResponseCreated, HttpResponseInternalServerError, HttpResponse, HttpResponseForbidden } from '@foal/core';
import { UserService } from '../services';
import { User } from '../entities';
import { UserRequestDto, UserResponseDto, UserLoginRequestDto } from '../dto';
import { InvalidInputError } from '../errors/invalid-input.error';
import { InvalidNicknameOrPasswordError } from '../errors';
import { ErrorData } from '../utils';

export class UserController {

  @dependency
  userServices: UserService

  @Get('/:id')
  async getUserById(ctx: Context): Promise<HttpResponse> {
    const id: number = ctx.request.params.id

    const user: User | undefined = await this.userServices.getUserById(id)

    if (!user) {
      
      const data: ErrorData = {
        message: 'User with requested id was not found'
      }

      return new HttpResponseNotFound(data)
    }

    return new HttpResponseOK({ user })

  }

  @Post('/signin')
  async signInUser(ctx: Context): Promise<HttpResponse> {
    const userToLogin: UserLoginRequestDto = ctx.request.body

    try {
     const token = await this.userServices.loginUser(userToLogin) 
     return new HttpResponseOK({ token })
    } catch (error) {
      const data: ErrorData = {
        message: error.message
      }

      if(error instanceof InvalidNicknameOrPasswordError) {
        return new HttpResponseForbidden(data)
      }

      return new HttpResponseInternalServerError(data)
    }


  }

  @Post('/')
  async registerUser(ctx: Context): Promise<HttpResponse> {

    const userToRegister: UserRequestDto = ctx.request.body

    const userWithSameNick: User | undefined = await this.userServices.getUserByNickname(userToRegister.nickname)

    if (userWithSameNick) {
      const data: ErrorData = {
        message: 'This nickname is already in use'
      }
      return new HttpResponseBadRequest(data)
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
      const data: ErrorData = {
        message: error.message
      }

      if (error instanceof InvalidInputError) {
          return new HttpResponseBadRequest(data)
      }
      return new HttpResponseInternalServerError(data)
    }

  }

}
