import {IsNotEmpty} from "class-validator";

export class CreateWishlistDto {

    @IsNotEmpty()
    customerId!: string;
}
