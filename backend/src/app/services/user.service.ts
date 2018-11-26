import { getRepository, Repository } from 'typeorm'
import { User } from '../entities';
import { UserRequestDto, UserResponseDto, UserLoginRequestDto } from '../dto';
import { InvalidInputError, InvalidNicknameOrPasswordError } from '../errors/';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { ITokenPayload } from '../utils';

export class UserService {

    private userRepository: Repository<User> = getRepository(User)

    public async getUserById(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: id }, relations: ['chats', 'messages'] });
    }

    public async getUserByNickname(nickname: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { nickname }, relations: ['chats', 'messages'] })
    }

    public async registerUser(user: UserRequestDto): Promise<User> {

        const errors: string[] = this.verifyUser(user)

        if (errors.length) {
            throw new InvalidInputError(errors)
        }

        const password: string = await this.hashPassword(user.password)

        const newUser: User = new User(user.name, user.nickname, password, user.imageUrl, user.birthday)

        user.isAdmin ? newUser.setAdmin() : newUser.setCommon()

        const savedUser: User = await this.userRepository.save(newUser)

        return savedUser;

    }

    public async searchUser(nickname: string): Promise<User[]> {
        const users: User[] = await this.userRepository.find()

        const usersFound: User[] = users.filter((u) => u.nickname.toLowerCase().includes(nickname.toLowerCase()))

        return usersFound
    }

    private verifyUser(userDto: UserRequestDto): string[] {
        const invalidInputs: string[] = []
        if (!userDto.name || userDto.name === '') {
            invalidInputs.push('Name')
        }
        if (!userDto.nickname || userDto.nickname.length < 3 || userDto.nickname.length > 35) {
            invalidInputs.push('Nickname')
        }
        if (!userDto.password || userDto.password.length < 3 || userDto.password.length > 35) {
            invalidInputs.push('Password')
        }
        if (!userDto.birthday || userDto.birthday === null || +userDto.birthday > Date.now()) {
            invalidInputs.push('Birthday')
        }
        if (!userDto.imageUrl && userDto.imageUrl !== "") {
            invalidInputs.push('Profile Image')
        }
        return invalidInputs
    }

    public async loginUser(login: UserLoginRequestDto) {
        
        const userFound: User | undefined = await this.getUserByNickname(login.nickname)

        if(!userFound) {
            throw new InvalidNicknameOrPasswordError()
        }

        const isPasswordOk: boolean = await compare(login.password, userFound.password)

        if(!isPasswordOk) {
            throw new InvalidNicknameOrPasswordError()
        }


        const tokenPayload: ITokenPayload = {
            id: userFound.id,
            isAdmin: userFound.isAdmin
        }

        const signOptions: SignOptions = {
            expiresIn: '3d'
        }

        const token: string = sign(tokenPayload, 'jwtPrivateKey', signOptions)

        return token

    }

    public getPayloadFromToken(token: string): ITokenPayload | undefined {
        try {
            const payload: ITokenPayload = verify(token, 'jwtPrivateKey') as ITokenPayload
            return payload
        } catch (error) {
            return undefined
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await genSalt()
        const hashed = await hash(password, salt)

        return hashed
    }

}
