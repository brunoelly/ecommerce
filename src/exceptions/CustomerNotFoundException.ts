import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerNotFoundException extends HttpException {
    constructor(id: number) {
        super(`Customer with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}