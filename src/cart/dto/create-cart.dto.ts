import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateCartDto {

    @IsNotEmpty()
    @IsNumber()
    cartId!: string;

    @IsNotEmpty()
    @IsNumber()
    productId!: string;

    @IsNotEmpty()
    @IsNumber()
    quantity!: number;

}
