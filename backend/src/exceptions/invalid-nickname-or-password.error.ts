import { HttpError } from "./http-error.error";
import { HttpStatus } from "@nestjs/common";

export class InvalidNicknameOrPasswordError extends HttpError {
    constructor() {
        super('Invalid nickname or password', HttpStatus.FORBIDDEN)
    }
}