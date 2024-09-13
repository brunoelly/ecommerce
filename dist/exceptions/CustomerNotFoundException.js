"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class CustomerNotFoundException extends common_1.HttpException {
    constructor(id) {
        super(`Customer with id ${id} not found`, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.CustomerNotFoundException = CustomerNotFoundException;
