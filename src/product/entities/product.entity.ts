import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrderItem} from "../../order-item/entities/order-item.entity";
import {Category} from "../../category/entities/category.entity";
import {Review} from "../../review/entities/review.entity";
import {Discount} from "../../discount/entities/discount.entity";
import {WishlistItem} from "../../wishlist-item/entities/wishlist-item.entity";
import {CartItem} from "../../cart-item/entities/cart-item.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    @Column()
    price!: number;

    @ManyToOne(() => Category, category => category.products)
    category!: Category;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems!: OrderItem[];

    @OneToMany(() => Review, review => review.product)
    reviews!: Review[];

    @OneToMany(() => Discount, discount => discount.product)
    discounts!: Discount[];

    @OneToMany(() => WishlistItem, wishlistItem => wishlistItem.product)
    wishlistItems!: WishlistItem[];

    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems!: CartItem[];
}