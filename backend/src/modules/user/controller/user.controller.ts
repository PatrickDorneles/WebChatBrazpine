import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { UserRequestDto, UserResponseDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { ErrorData } from 'src/utils';
import { User } from '../entity/user.entity';
import { HttpError } from 'src/exceptions/http-error.error';
import { AuthGuard } from '@nestjs/passport';
import { UserNotFoundError } from 'src/exceptions';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('/:id')
    @UseGuards(AuthGuard())
    async getUserById(@Param('id') userId: number) {
        const userFound: User = await this.userService.getUserById(userId)

        if (!userFound) {
            const data: ErrorData = {
                message: 'User not found'
            }
            throw new HttpException(data, HttpStatus.NOT_FOUND)
        }

        const user: UserResponseDto = {
            id: userFound.id,
            name: userFound.name,
            nickname: userFound.nickname,
            imageUrl: userFound.imageUrl,
            birthday: userFound.birthday
        }

        return {
            user
        }
    }

    @Post('signup')
    public async signUpUser(@Body() userToRegister: UserRequestDto) {

        const userWithSameNick: User | undefined = await this.userService.getUserByNickname(userToRegister.nickname)

        if (userWithSameNick) {
            const data: ErrorData = {
                message: 'This nickname is already in use'
            }
            throw new HttpException(data, HttpStatus.BAD_REQUEST)
        }

        try {
            const user: User = await this.userService.registerUser(userToRegister)

            const savedUser: UserResponseDto = {
                id: user.id,
                name: user.name,
                nickname: user.nickname,
                imageUrl: user.imageUrl,
                birthday: user.birthday
            }

            return { savedUser }

        } catch (error) {
            const data: ErrorData = {
                message: error.message
            }

            if (error instanceof HttpError) {
                throw new HttpException(data, error.httpStatus)
            }

            throw new HttpException(data, HttpStatus.INTERNAL_SERVER_ERROR)


        }
    }

}
