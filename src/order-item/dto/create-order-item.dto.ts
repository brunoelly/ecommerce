import {Order} from "../../order/entities/order.entity";
import {Product} from "../../product/entities/product.entity";
import {IsArray, IsNumber} from "class-validator";

export class CreateOrderItemDto {

    @IsNumber()
    quantity!: number;

    @IsArray()
    price!: number;

    @IsArray()
    order!: Order;

    @IsArray()
    product!: Product;

}


