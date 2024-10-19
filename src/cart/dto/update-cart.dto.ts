import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import {IsArray, IsNumber, IsOptional} from "class-validator";
import {Customer} from "../../customer/entities/customer.entity";
import {CartItem} from "../../cart-item/entities/cart-item.entity";

export class UpdateCartDto extends PartialType(CreateCartDto) {

    @IsOptional()
    @IsArray()
    cartItems?: CartItem[];

    @IsOptional()
    @IsNumber()
    customerId?: string;
}
