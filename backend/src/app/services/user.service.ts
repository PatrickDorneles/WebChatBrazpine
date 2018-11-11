import { getRepository, Repository } from 'typeorm'
import { User } from '../entities';
import { UserRequestDto, UserResponseDto } from '../dto';
import { InvalidInputError } from '../errors/error.invalid-input';

export class UserService {

    private userRepository: Repository<User> = getRepository(User)

    async getUserById(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: id }, relations: ['userChats', 'messages'] });
    }

    async getUserByNickname(nickname: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { nickname }, relations: ['userChats', 'messages'] })
    }

    async registerUser(user: UserRequestDto): Promise<UserResponseDto> {

        const errors: string[] = this.verifyUser(user)

        if (errors.length) {
            throw new InvalidInputError(errors)
        }

        const newUser: User = new User(user.name, user.nickname, user.password, user.imageUrl, user.birthday)

        const savedUser: User = await this.userRepository.save(newUser)

        const userResponse: UserResponseDto = {
            name: savedUser.name,
            nickname: savedUser.nickname,
            birthday: savedUser.birthday,
            imageUrl: savedUser.imageUrl,
            userChats: savedUser.userChats
        }

        return userResponse;

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
        if (!userDto.imageUrl) {
            invalidInputs.push('Profile Image')
        }
        return invalidInputs
    }

}
