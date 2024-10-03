import { Order } from "../../order/entities/order.entity";
import {IsNotEmpty} from "class-validator";

export class CreateShippingDto {

    @IsNotEmpty()
    address!: string;

    @IsNotEmpty()
    order!: Order;
}
