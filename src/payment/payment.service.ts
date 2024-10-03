import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {Repository} from "typeorm";
import {CreatePaymentDto} from "./dto/create-payment.dto";
import {UpdatePaymentDto} from "./dto/update-payment.dto";

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
      @InjectRepository(Payment)
      private readonly paymentRepository: Repository<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    this.logger.log('Iniciando a criação do pagamento.');

    try {
      const payment = this.paymentRepository.create(createPaymentDto);
      const savedPayment = await this.paymentRepository.save(payment);
      this.logger.log(`Pagamento criado com sucesso: ${savedPayment.id}`);
      return savedPayment;
    } catch (error) {
      this.logger.error('Erro ao criar pagamento', error);
      throw new HttpException('Erro ao criar pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({ relations: ['method', 'order'] });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id }, relations: ['method', 'order'] });
    if (!payment) {
      throw new HttpException('Pagamento não encontrado.', HttpStatus.NOT_FOUND);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: Partial<UpdatePaymentDto>): Promise<Payment> {
    this.logger.log(`Atualizando pagamento com ID: ${id}`);

    const payment = await this.paymentRepository.findOne({ where: { id: id } });
    if (!payment) {
      this.logger.warn(`Pagamento não encontrado: ${id}`);
      throw new HttpException('Pagamento não encontrado.', HttpStatus.NOT_FOUND);
    }

    Object.assign(payment, updatePaymentDto);

    try {
      const updatedPayment = await this.paymentRepository.save(payment);
      this.logger.log(`Pagamento atualizado com sucesso: ${updatedPayment.id}`);
      return updatedPayment;
    } catch (error) {
      this.logger.error('Erro ao atualizar pagamento', error);
      throw new HttpException('Erro ao atualizar pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<void> {
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