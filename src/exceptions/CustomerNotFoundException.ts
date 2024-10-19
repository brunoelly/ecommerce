import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerNotFoundException extends HttpException {
    constructor(id: string) {
        super(`Customer with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}