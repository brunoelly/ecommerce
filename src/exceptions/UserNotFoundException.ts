import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor(id: string) {
        super(`Usuário com id ${id} não encontrado`, HttpStatus.NOT_FOUND);
    }
}