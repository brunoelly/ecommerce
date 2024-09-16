import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {Repository} from "typeorm";

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
      @InjectRepository(Payment)
      private readonly paymentRepository: Repository<Payment>) {}

  async create(paymentData: Payment): Promise<Payment> {
    this.logger.log('Iniciando a criação do pagamento.');

    try {
      const payment = this.paymentRepository.create(paymentData);
      const savedPayment = await this.paymentRepository.save(payment);
      this.logger.log(`Pagamento criado com sucesso: ${savedPayment.id}`);
      return savedPayment;
    } catch (error) {
      this.logger.error('Erro ao criar pagamento', error);
      throw new HttpException('Erro ao criar pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    this.logger.log(`Atualizando pagamento com ID: ${id}`);

    const payment = await this.paymentRepository.findOne({ where: { id: id } });
    if (!payment) {
      this.logger.warn(`Pagamento não encontrado: ${id}`);
      throw new HttpException('Pagamento não encontrado.', HttpStatus.NOT_FOUND);
    }

    Object.assign(payment, paymentData);

    try {
      const updatedPayment = await this.paymentRepository.save(payment);
      this.logger.log(`Pagamento atualizado com sucesso: ${updatedPayment.id}`);
      return updatedPayment;
    } catch (error) {
      this.logger.error('Erro ao atualizar pagamento', error);
      throw new HttpException('Erro ao atualizar pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Removendo pagamento com ID: ${id}`);

    const payment = await this.paymentRepository.findOne({ where: { id: id } });
    if (!payment) {
      this.logger.warn(`Pagamento não encontrado: ${id}`);
      throw new HttpException('Pagamento não encontrado.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.paymentRepository.remove(payment);
      this.logger.log(`Pagamento removido com sucesso: ${id}`);
    } catch (error) {
      this.logger.error('Erro ao remover pagamento', error);
      throw new HttpException('Erro ao remover pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}