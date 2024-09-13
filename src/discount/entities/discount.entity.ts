import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Product} from "../../product/entities/product.entity";

@Entity()
export class Discount {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    code!: string;

    @Column()
    amount!: number;

    @ManyToOne(() => Product, product => product.discounts)
    product!: Product;
}