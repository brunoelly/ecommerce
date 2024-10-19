import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 20)  // Exemplo de validação para a senha
    password!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;
}