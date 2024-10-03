import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from "../../order/entities/order.entity";
import { Review } from "../../review/entities/review.entity";
import { Wishlist } from "../../wishlist/entities/wishlist.entity";
import { Cart } from "../../cart/entities/cart.entity";
import { Contact } from "../../contact/entities/contact.entity";
import { Address } from "../../address/entities/address.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @OneToOne(() => User, user => user.customer)
    @JoinColumn()
    user!: User;

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