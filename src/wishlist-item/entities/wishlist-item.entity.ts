import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {Wishlist} from "../../wishlist/entities/wishlist.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class WishlistItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Wishlist, wishlist => wishlist.wishlistItems)
    wishlist!: Wishlist;

    @ManyToOne(() => Product, product => product.wishlistItems)
    product!: Product;
}