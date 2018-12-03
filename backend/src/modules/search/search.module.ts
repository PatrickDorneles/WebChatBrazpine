import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { SearchService } from './service/search.service';
import { PassportModule } from '@nestjs/passport';
import { SearchController } from './controller/search.controller';

@Module({
    imports: [
        UserModule,
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [
        SearchService
    ],
    controllers: [
        SearchController
    ]
})
export class SearchModule { };