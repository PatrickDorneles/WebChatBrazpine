import { getRepository, Repository } from 'typeorm'
import { User } from '../entities';
import { UserRequestDto, UserResponseDto } from '../dto';
import { InvalidInputError } from '../errors/';
import { genSalt, hash } from 'bcrypt';

export class UserService {

    private userRepository: Repository<User> = getRepository(User)

    public async getUserById(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { id: id }, relations: ['chats', 'messages'] });
    }

    public async getUserByNickname(nickname: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { nickname }, relations: ['chats', 'messages'] })
    }

    public async registerUser(user: UserRequestDto): Promise<UserResponseDto> {

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

    public async searchUser(nickname: string): Promise<UserResponseDto[]> {
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

    private async hashPassword(password: string): Promise<string> {
        const salt = await genSalt()
        const hashed = await hash(password, salt)

        return hashed
    }

}
