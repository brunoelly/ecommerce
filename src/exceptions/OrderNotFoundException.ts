import {HttpException, HttpStatus} from "@nestjs/common";

export class OrderNotFoundException extends HttpException {
    constructor(id: number) {
        super(`Order with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}