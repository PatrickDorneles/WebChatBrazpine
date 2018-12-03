import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt'
import { InvalidInputError } from 'src/exceptions';
import { UserRequestDto } from '../dto/user.dto';
import { ContactUser } from 'src/socket/interfaces/socket.interfaces';
import { AuthService } from 'src/modules/auth/service/auth.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public async getUsers() {
        return await this.userRepository.find({ relations: ['chats', 'messages', 'chats.users'] })
    }

    public async getUserById(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: id }, relations: ['chats', 'messages', 'chats.users'] });
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

    private async hashPassword(password: string): Promise<string> {
        const salt = await genSalt()
        const hashed = await hash(password, salt)

        return hashed
    }

}
