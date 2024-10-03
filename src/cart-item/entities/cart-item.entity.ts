import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Cart} from "../../cart/entities/cart.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class CartItem {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    quantity!: number;

    @ManyToOne(() => Cart, cart => cart.cartItems)
    cart!: Cart;

    @ManyToOne(() => Product, product => product.cartItems)
    product!: Product;
}