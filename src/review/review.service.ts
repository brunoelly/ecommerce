import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";
import {Repository} from "typeorm";

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
      @InjectRepository(Review)
      private readonly reviewRepository: Repository<Review>,) {}

  async create(reviewData: Review): Promise<Review> {
    this.logger.log('Iniciando a criação da avaliação.');

    // Validação da avaliação
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      this.logger.warn(`Avaliação inválida: ${reviewData.rating}`);
      throw new HttpException('Avaliação deve ser entre 1 e 5.', HttpStatus.BAD_REQUEST);
    }

    try {
      const review = this.reviewRepository.create(reviewData);
      const savedReview = await this.reviewRepository.save(review);
      this.logger.log(`Avaliação criada com sucesso: ${savedReview.id}`);
      return savedReview;
    } catch (error) {
      this.logger.error('Erro ao criar avaliação', error);
      throw new HttpException('Erro ao criar avaliação.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, reviewData: Partial<Review>): Promise<Review> {
    this.logger.log(`Atualizando avaliação com ID: ${id}`);

    const review = await this.reviewRepository.findOne(id);
    if (!review) {
      this.logger.warn(`Avaliação não encontrada: ${id}`);
      throw new HttpException('Avaliação não encontrada.', HttpStatus.NOT_FOUND);
    }

    Object.assign(review, reviewData); // Atualiza os dados da avaliação

    try {
      const updatedReview = await this.reviewRepository.save(review);
      this.logger.log(`Avaliação atualizada com sucesso: ${updatedReview.id}`);
      return updatedReview;
    } catch (error) {
      this.logger.error('Erro ao atualizar avaliação', error);
      throw new HttpException('Erro ao atualizar avaliação.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Removendo avaliação com ID: ${id}`);

    const review = await this.reviewRepository.findOne(id);
    if (!review) {
      this.logger.warn(`Avaliação não encontrada: ${id}`);
      throw new HttpException('Avaliação não encontrada.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.reviewRepository.remove(review);
      this.logger.log(`Avaliação removida com sucesso: ${id}`);
    } catch (error) {
      this.logger.error('Erro ao remover avaliação', error);
      throw new HttpException('Erro ao remover avaliação.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}