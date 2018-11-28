import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/modules/user/service/user.service';
import { AuthTokenPayload } from '../interface/auth.interface';
import { User } from 'src/modules/user/entity/user.entity';
import { InvalidNicknameOrPasswordError } from 'src/exceptions';
import { SignOptions } from 'jsonwebtoken';
import { AuthRequestDto } from '../dto/auth.dto';
import { compare } from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) { }

    async authUser(authReq: AuthRequestDto): Promise<string> {

        const user: User | undefined = await this.userService.getUserByNickname(authReq.nickname)

        if (!user) {
            throw new InvalidNicknameOrPasswordError()
        }

        const isPasswordOk: boolean = await compare(authReq.password, user.password)

        if (!isPasswordOk) {
            throw new InvalidNicknameOrPasswordError()
        }

        const tokenPayload: AuthTokenPayload = {
            id: user.id,
            isAdmin: user.isAdmin
        }

        const tokenOptions: SignOptions = {
            expiresIn: '3d'
        }

        return this.jwtService.sign(tokenPayload, tokenOptions)

    }

    async getUserByPayload(tokenPayload: AuthTokenPayload): Promise<User | undefined> {
        return await this.userService.getUserById(tokenPayload.id)
    }

}