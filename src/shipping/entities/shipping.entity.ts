import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Order} from "../../order/entities/order.entity";

@Entity()
export class Shipping {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    address!: string;

    @ManyToOne(() => Order, order => order.shippings)
    order!: Order;
}