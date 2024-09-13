import {IsArray, IsNotEmpty} from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    product!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    price!: number;

    @IsNotEmpty()
    totalAmount!: number;

    @IsArray()
    productsIds!: number[];
}