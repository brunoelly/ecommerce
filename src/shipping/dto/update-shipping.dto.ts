import { PartialType } from '@nestjs/swagger';
import { CreateShippingDto } from './create-shipping.dto';
import {Order} from "../../order/entities/order.entity";
import {IsOptional} from "class-validator";

export class UpdateShippingDto extends PartialType(CreateShippingDto) {

    @IsOptional()
    address?: string;

    @IsOptional()
    order?: Order;
}
