import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Order} from "../../order/entities/order.entity";
import {Review} from "../../review/entities/review.entity";
import {Wishlist} from "../../wishlist/entities/wishlist.entity";
import {Cart} from "../../cart/entities/cart.entity";
import {Contact} from "../../contact/entities/contact.entity";
import {Address} from "../../address/entities/address.entity";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    phone!: string;

    @OneToMany(() => Order, order => order.customer)
    orders!: Order[];

    @OneToMany(() => Review, review => review.customer)
    reviews!: Review[];

    @OneToMany(() => Wishlist, wishlist => wishlist.customer)
    wishlists!: Wishlist[];

    @OneToMany(() => Cart, cart => cart.customer)
    carts!: Cart[];

    @OneToMany(() => Address, address => address.customer)
    addresses!: Address[];

    @OneToMany(() => Contact, contact => contact.customer)
    contacts!: Contact[];
}