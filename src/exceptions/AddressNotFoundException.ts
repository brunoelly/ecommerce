import { HttpException, HttpStatus } from '@nestjs/common';

export class AddressNotFoundException extends HttpException {
    constructor(id: string) {
        super(`Address with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}