import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Customer} from "../../customer/entities/customer.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @OneToMany(() => Customer, customer => customer.user)
    customers!: Customer[];

    @Column({ unique: true })
    email!: string;
}