import { Controller, Get, Param, UseGuards, Headers } from '@nestjs/common';
import { SearchService } from '../service/search.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserHeaderDto } from 'src/modules/auth/dto/auth.dto';
import { ContactUser } from 'src/socket/interfaces/socket.interfaces';

@Controller('search')
export class SearchController {

    constructor(private readonly searchService: SearchService) { }

    @Get('/:search')
    @UseGuards(AuthGuard())
    async searchUser(@Param('search') search: string, @Headers() headers: AuthUserHeaderDto) {
        const contactsFound: ContactUser[] = await this.searchService.searchUsersWithToken(search, headers.authorization)

        return contactsFound
    }

}