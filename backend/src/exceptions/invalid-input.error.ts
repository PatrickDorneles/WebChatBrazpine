import { HttpError } from "./http-error.error";
import { HttpStatus } from "@nestjs/common";

export class InvalidInputError extends HttpError {
    constructor(inputs: string[]) {
        const message: string = `These fields weren't filled correctly: ${inputs.map(i => `${i}`)}`
        super(message, HttpStatus.BAD_REQUEST)
    }
}