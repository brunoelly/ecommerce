import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number; // Classificação opcional entre 1 e 5

    @IsOptional()
    @IsString()
    comment?: string;
}
