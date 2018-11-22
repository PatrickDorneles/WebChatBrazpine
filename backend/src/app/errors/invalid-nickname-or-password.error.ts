export class InvalidNicknameOrPasswordError extends Error {
    constructor() {
        super('Invalid nickname or password')
    }
}