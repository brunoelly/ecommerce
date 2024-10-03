import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";
import {CartItem} from "../../cart-item/entities/cart-item.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Customer, customer => customer.carts)
    customer!: Customer;

    @OneToMany(() => CartItem, cartItem => cartItem.cart)
    cartItems!: CartItem[];
}