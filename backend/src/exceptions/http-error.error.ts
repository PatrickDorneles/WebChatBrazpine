import { HttpStatus } from "@nestjs/common";

export class HttpError extends Error {

    public httpStatus: HttpStatus

    constructor(message: string, httpStatus: HttpStatus) {
        super(message)
        this.httpStatus = httpStatus
    }
}