import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateDiscountDto {

    @IsNotEmpty()
    @IsString()
    code!: string;

    @IsNotEmpty()
    @IsNumber()
    amount!: number;

    @IsNotEmpty()
    @IsNumber()
    productId!: string;
}
