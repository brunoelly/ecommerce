import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Product} from "../../product/entities/product.entity";
import {Customer} from "../../customer/entities/customer.entity";

@Entity()
export class Review {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    rating!: number;

    @Column()
    comment!: string;

    @ManyToOne(() => Product, product => product.reviews)
    product!: Product;

    @ManyToOne(() => Customer, customer => customer.reviews)
    customer!: Customer;
}