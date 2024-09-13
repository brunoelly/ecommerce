import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Order} from "../../order/entities/order.entity";
import {PaymentMethod} from "../../payment-method/entities/payment-method.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments)
    method!: PaymentMethod;

    @ManyToOne(() => Order, order => order.payments)
    order!: Order;
}