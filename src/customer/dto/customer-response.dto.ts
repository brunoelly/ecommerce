import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import {AddressResponseDto} from "../../address/dto/address-response.dto";
import { ContactResponseDto } from '../../contact/dto/contact-response.dto';

export class CustomerResponseDto {
    
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsString()
    cpf!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsPhoneNumber("BR")
    phone!: string;

    @IsOptional()
    userId?: string;

    @IsOptional()
    addresses!: AddressResponseDto[];

    @IsArray()
    contacts!: ContactResponseDto[];
}