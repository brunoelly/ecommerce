import {Customer} from "../../customer/entities/customer.entity";
import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {Product} from "../../product/entities/product.entity";

export class CreateReviewDto {

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsNotEmpty()
    @IsString()
    comment!: string;

    @IsNotEmpty()
    product!: Product;

    @IsNotEmpty()
    customer!: Customer;
}
