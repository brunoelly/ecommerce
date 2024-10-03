import { IsOptional, IsString, IsPostalCode } from 'class-validator';

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsOptional()
    @IsPostalCode('BR')
    zipCode?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;
}