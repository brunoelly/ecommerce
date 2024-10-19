import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Order} from "../../order/entities/order.entity";
import {Review} from "../../review/entities/review.entity";
import {Wishlist} from "../../wishlist/entities/wishlist.entity";
import {Cart} from "../../cart/entities/cart.entity";
import {Contact} from "../../contact/entities/contact.entity";
import {Address} from "../../address/entities/address.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @ManyToOne(() => User, (user: User) => user.customers, { eager: true })
    @JoinColumn()
    user!: User;

    @OneToMany(() => Address, (address: Address) => address.customer, { eager: true })
    addresses!: Address[];

    @OneToMany(() => Order, (order: Order) => order.customer)
    orders!: Order[];

    @OneToMany(() => Review, (review: Review) => review.customer)
    reviews!: Review[];

    @OneToMany(() => Wishlist, (wishlist: Wishlist) => wishlist.customer)
    wishlists!: Wishlist[];

    @OneToMany(() => Cart, (cart: Cart) => cart.customer)
    carts!: Cart[];

    @OneToMany(() => Contact, (contact: Contact) => contact.customer)
    contacts!: Contact[];
}