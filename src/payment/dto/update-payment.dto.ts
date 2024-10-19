import {PartialType} from '@nestjs/swagger';
import {CreatePaymentDto} from './create-payment.dto';
import {IsOptional} from "class-validator";
import {PaymentMethod} from "../../payment-method/entities/payment-method.entity";
import {Order} from "../../order/entities/order.entity";

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {

    @IsOptional()
    method?: PaymentMethod;

    @IsOptional()
    order?: Order;
}
