import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from "../../customer/entities/customer.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @OneToOne(() => Customer, customer => customer.user)
    customer!: Customer;

    @Column({ unique: true })
    email!: string;
}