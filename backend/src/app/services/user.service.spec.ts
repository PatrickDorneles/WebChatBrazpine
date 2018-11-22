import { createService } from "@foal/core";
import { UserService } from "./user.service";
import { UserRequestDto, UserResponseDto, UserLoginRequestDto } from "../dto";
import { fail, ok } from "assert";
import { InvalidInputError, InvalidNicknameOrPasswordError } from "../errors";
import { createConnection, Connection } from "typeorm";
import { User, Message, Chat } from "../entities";
import { genSalt, hash } from "bcrypt";
import { verify } from 'jsonwebtoken'
import { ITokenPayload } from "../utils";




describe('User Service', () => {

    let connection: Connection
    let service: UserService

    before(async () => {
        connection = await createConnection({
            // Choose a test database. You don't want to run your tests on your production data.
            database: './test_db.sqlite3',
            // Drop the schema when the connection is established.
            dropSchema: true,
            // Register the models that are used.
            entities: [User, Message, Chat],
            // Auto create the database schema.
            synchronize: true,
            // Specify the type of database.
            type: 'sqlite',
        });
        service = createService(UserService)
    })

    describe('register user', () => {

        it('should throw an error if name is empty', async () => {

            const userMock: UserRequestDto = {
                name: '',
                nickname: 'John',
                password: 'password',
                imageUrl: '',
                birthday: new Date()
            }

            try {
                await service.registerUser(userMock)
                fail('should throw an error')
            } catch (error) {
                ok(error instanceof InvalidInputError)
            }


        })

        it('should throw an error if nickname is empty', async () => {

            const userMock: UserRequestDto = {
                name: 'John',
                nickname: '',
                password: 'password',
                imageUrl: '',
                birthday: new Date()
            }

            try {
                await service.registerUser(userMock)
                fail('should throw an error')
            } catch (error) {
                ok(error instanceof InvalidInputError)
            }


        })

        it('should throw an error if password is empty', async () => {

            const userMock: UserRequestDto = {
                name: 'John',
                nickname: 'John',
                password: '',
                imageUrl: '',
                birthday: new Date()
            }

            try {
                await service.registerUser(userMock)
                fail('should throw an error')
            } catch (error) {
                ok(error instanceof InvalidInputError)
            }


        })

        it('should register the user', async () => {

            const userMock: UserRequestDto = {
                name: 'John',
                nickname: 'John',
                password: 'password',
                imageUrl: '',
                birthday: new Date()
            }

            try {
                const user: UserResponseDto = await service.registerUser(userMock)
                ok(user)
            } catch (error) {
                fail("shouldn't throw error")
            }


        })

    })


    describe('login user', () => {

        it("should throw an error if the user doesn't exist", async () => {

            service.getUserByNickname = (nickname: string) => {
                return new Promise((resolve) => {
                    resolve(undefined)
                })
            }

            const loginMock: UserLoginRequestDto = {
                nickname: 'Joao',
                password: '1234'
            }

            try {
                await service.loginUser(loginMock)
                fail('should throw an error')
            } catch (error) {
                ok(error instanceof InvalidNicknameOrPasswordError)
            }

        })

        it("should throw an error if the password is wrong", async () => {

            const encript: (password: string) => Promise<string> = async (password: string): Promise<string> => {
                const salt = await genSalt()
                const hashed = await hash(password, salt)

                return hashed
            }

            service.getUserByNickname = (nickname: string) => {
                return new Promise(async (resolve) => {
                    resolve({
                        nickname: nickname,
                        password: await encript('1234')
                    } as User)
                })
            }

            const loginMock: UserLoginRequestDto = {
                nickname: 'Joao',
                password: '4321'
            }

            try {
                await service.loginUser(loginMock)
                fail('should throw an error')
            } catch (error) {
                ok(error instanceof InvalidNicknameOrPasswordError)
            }

        })

        it('should return a token', async () => {

            const encript: (password: string) => Promise<string> = async (password: string): Promise<string> => {
                const salt = await genSalt()
                const hashed = await hash(password, salt)

                return hashed
            }

            const mockUserToReceive = {
                id: 1,
                nickname: 'Joao',
                password: await encript('1234'),
                isAdmin: false
            } as User

            service.getUserByNickname = (nickname: string) => {
                return new Promise(async (resolve) => {
                    resolve(mockUserToReceive)
                })
            }

            const loginMock: UserLoginRequestDto = {
                nickname: 'Joao',
                password: '1234'
            }

            try {
                const token = await service.loginUser(loginMock)
                const decoded = verify(token, 'jwtPrivateKey') as ITokenPayload
                ok(decoded.id === mockUserToReceive.id && decoded.isAdmin === mockUserToReceive.isAdmin)
            } catch (error) {
                fail("shouldn't throw an error")
            }


        })

    })

    after(async () => {
        await connection.dropDatabase()
        await connection.close()
    })

})