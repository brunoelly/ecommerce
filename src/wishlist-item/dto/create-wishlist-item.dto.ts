import {IsNotEmpty} from "class-validator";

export class CreateWishlistItemDto {

    @IsNotEmpty()
    productId!: string;

    @IsNotEmpty()
    wishlistId!: string;
}
