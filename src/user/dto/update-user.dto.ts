import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    @Length(6, 20)
    password?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}