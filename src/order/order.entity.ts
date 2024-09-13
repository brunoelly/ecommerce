import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../product/product.entity";

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

    @ManyToMany(() => Product, (product) => product.orders, { eager: true })
    products!: Product[];
}