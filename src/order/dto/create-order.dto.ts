import {IsArray, IsNotEmpty} from "class-validator";

export class CreateOrderDto {

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    createdAt!: Date;

    @IsNotEmpty()
    updatedAt!: Date;

    @IsNotEmpty()
    price!: number;

    @IsNotEmpty()
    totalAmount!: number;

    @IsArray()
    customersIds!: string[];

    @IsArray()
    ordersIds!: string[];

    @IsArray()
    paymentsIds!: string[];

    @IsArray()
    shippingsIds!: string[];
}