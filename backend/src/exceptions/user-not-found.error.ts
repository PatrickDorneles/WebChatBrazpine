import { HttpError } from "./http-error.error";
import { HttpStatus } from "@nestjs/common";

export class UserNotFoundError extends HttpError {
    constructor() {
        const message: string = `User was not found`
        super(message, HttpStatus.NOT_FOUND)
    }
}