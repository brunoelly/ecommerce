import { IsString } from 'class-validator';

export class ContactResponseDto {
    @IsString()
    id!: string;

    @IsString()
    phoneNumber!: string;

    @IsString()
    email!: string;
}