import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Payment} from "../../payment/entities/payment.entity";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Payment, payment => payment.method)
    payments!: Payment[];
}