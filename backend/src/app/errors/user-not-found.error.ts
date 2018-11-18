export class UserNotFoundError extends Error {
    constructor() {
        const message: string = `User was not found`
        super(message)
    }
}