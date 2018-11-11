import { Context, Get, HttpResponseOK, dependency, HttpResponseNotFound, Post, HttpResponseBadRequest, HttpResponseCreated, HttpResponseInternalServerError } from '@foal/core';
import { UserService } from '../services';
import { User } from '../entities';
import { UserRequestDto, UserResponseDto } from '../dto';
import { InvalidInputError } from '../errors/error.invalid-input';

export class UserController {

  @dependency
  userServices: UserService

  @Get('/:id')
  async getUserById(ctx: Context) {
    const id: number = ctx.request.params.id

    const user: User | undefined = await this.userServices.getUserById(id)

    if (!user) {
      return new HttpResponseNotFound({ message: 'User with requested id was not found' })
    }

    return new HttpResponseOK({ user })

  }

  @Post('/')
  async registerUser(ctx: Context) {

    const userToRegister: UserRequestDto = ctx.request.body

    const userWithSameNick: User | undefined = await this.userServices.getUserByNickname(userToRegister.nickname)

    if (userWithSameNick) {
      return new HttpResponseBadRequest({ message: 'This nickname is already in use' })
    }

    try {
      const savedUser: UserResponseDto = await this.userServices.registerUser(userToRegister)
      return new HttpResponseCreated({ savedUser })
    } catch (error) {
      if (error instanceof InvalidInputError) {
        return new HttpResponseBadRequest({ message: error.message })
      }
      return new HttpResponseInternalServerError({ message: error.message })
    }

  }

}
