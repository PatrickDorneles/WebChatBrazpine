import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { AuthRequestDto } from "../dto/auth.dto";
import { ErrorData } from "src/utils";
import { HttpError } from "src/exceptions/http-error.error";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('')
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

}
