import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Headers } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { AuthRequestDto, AuthUserHeaderDto } from "../dto/auth.dto";
import { ErrorData } from "src/utils";
import { HttpError } from "src/exceptions/http-error.error";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/modules/user/entity/user.entity";
import { UserResponseDto } from "src/modules/user/dto/user.dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post()
    async authenticate(@Body() authUser: AuthRequestDto) {
        try {
            const token: string = await this.authService.authUser(authUser)

            return {
                token
            }
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

    @Get()
    @UseGuards(AuthGuard())
    async getAthenticatedUser(@Headers() headers: AuthUserHeaderDto) {
        const userFound: User = await this.authService.getUserByToken(headers.authorization)

        const user: UserResponseDto = {
            id: userFound.id,
            name: userFound.name,
            nickname: userFound.nickname,
            imageUrl: userFound.imageUrl,
            birthday: userFound.birthday,
            isAdmin: userFound.isAdmin
        }

        return {
            user
        }
    }

}
