import { IsEmail, IsString } from 'class-validator';

export class UserResponseDto {
    @IsString()
    id!: string;

    @IsString()
    username!: string;

    @IsEmail()
    email!: string;

}