import {IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString} from 'class-validator';
import {PrimaryGeneratedColumn} from "typeorm";
import {Address} from "../../address/entities/address.entity";

export class CreateCustomerDto {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    cpf!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsPhoneNumber("BR")
    phone!: string;

    @IsOptional()
    userId!: string;

    @IsOptional()
    addresses!: Address[];
}