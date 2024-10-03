import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber("BR")
    phone?: string;
}