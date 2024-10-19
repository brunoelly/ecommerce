import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";

@Entity()
export class Contact {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    phoneNumber!: string;

    @Column()
    email!: string;

    @ManyToOne(() => Customer, customer => customer.contacts)
    customer!: Customer;
}