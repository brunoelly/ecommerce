import {PaymentMethod} from "../../payment-method/entities/payment-method.entity";
import {Order} from "../../order/entities/order.entity";
import {IsNotEmpty} from "class-validator";

export class CreatePaymentDto {

    @IsNotEmpty()
    method!: PaymentMethod;

    @IsNotEmpty()
    order!: Order;
}
