import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";
import {WishlistItem} from "../../wishlist-item/entities/wishlist-item.entity";

@Entity()
export class Wishlist {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Customer, customer => customer.wishlists)
    customer!: Customer;

    @OneToMany(() => WishlistItem, wishlistItem => wishlistItem.wishlist)
    wishlistItems!: WishlistItem[];
}