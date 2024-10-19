import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";

@Entity()
export class Address {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    street!: string;

    @Column()
    number!: string;

    @Column({ nullable: true })
    complement!: string;

    @Column()
    zipCode!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column()
    country!: string;

    @ManyToOne(() => Customer, customer => customer.addresses)
    customer!: Customer;
}