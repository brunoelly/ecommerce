import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Customer} from "../../customer/entities/customer.entity";
import {OrderItem} from "../../order-item/entities/order-item.entity";
import {Payment} from "../../payment/entities/payment.entity";
import {Shipping} from "../../shipping/entities/shipping.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    @Column()
    price!: number;

    @Column()
    totalAmount!: number;

    @ManyToOne(() => Customer, customer => customer.orders)
    customer!: Customer;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems!: OrderItem[];

    @OneToMany(() => Payment, payment => payment.order)
    payments!: Payment[];

    @OneToMany(() => Shipping, shipping => shipping.order)
    shippings!: Shipping[];
}