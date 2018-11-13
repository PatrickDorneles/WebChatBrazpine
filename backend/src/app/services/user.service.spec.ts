import { createService } from "@foal/core";
import { UserService } from "./user.service";
import { UserRequestDto, UserResponseDto } from "../dto";
import { fail, ok } from "assert";
import { InvalidInputError } from "../errors";
import { createConnection, Connection } from "typeorm";
import { connect } from "tls";




describe('User Service', () => {

    let connection: Connection 
    let service: UserService

    before(async () => {
        connection = await createConnection()
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

    after(async () => {
        await connection.close()
    })

})