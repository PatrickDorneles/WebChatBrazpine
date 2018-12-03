import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { User } from 'src/modules/user/entity/user.entity';
import { ContactUser } from 'src/socket/interfaces/socket.interfaces';

@Injectable()
export class SearchService {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    public async searchUser(nickname: string): Promise<User[]> {
        const users: User[] = await this.userService.getUsers()

        const usersFound: User[] = users.filter((u) => u.nickname.toLowerCase().includes(nickname.toLowerCase()))

        return usersFound
    }

    public async searchUsersWithToken(search: string, token: string) {
        let usersFound: User[] = await this.searchUser(search)
        const connectedUser = await this.authService.getUserByToken(token)

        console.log(connectedUser.chats);


        const searchQuery = (u: User) => u.id !== connectedUser.id && !connectedUser.chats.find(c => c.users.find(u2 => u2.id === u.id) !== undefined)

        usersFound = usersFound.filter(searchQuery)

        const contactsFound = usersFound.map((u): ContactUser => {
            return {
                id: u.id,
                name: u.name,
                nickname: u.nickname,
                imageUrl: u.imageUrl
            }
        })

        return contactsFound
    }

}