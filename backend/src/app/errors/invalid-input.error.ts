export class InvalidInputError extends Error {
    constructor(inputs: string[]) {
        const message: string = `These fields weren't filled correctly: ${inputs.map(i => `*${i}\n`)}`
        super(message)
    }
}