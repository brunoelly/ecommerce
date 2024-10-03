import { IsNotEmpty, IsOptional, IsString, IsPostalCode } from 'class-validator';

export class CreateAddressDto {

    @IsNotEmpty()
    @IsString()
    street!: string;

    @IsNotEmpty()
    @IsString()
    number!: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsNotEmpty()
    @IsPostalCode('BR')
    zipCode!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsNotEmpty()
    @IsString()
    state!: string;

    @IsNotEmpty()
    @IsString()
    country!: string;

    @IsNotEmpty()
    customerId!: string;
}