import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Order} from "../../order/entities/order.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    quantity!: number;

    @Column()
    price!: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order!: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    product!: Product;
}