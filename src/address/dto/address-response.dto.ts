import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressResponseDto {
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
    @IsString()
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
}