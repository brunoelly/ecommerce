import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;
}