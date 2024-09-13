import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @OneToOne(() => Customer, customer => customer.user)
    customer!: Customer;
}