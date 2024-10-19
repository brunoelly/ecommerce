import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Shipping} from "./entities/shipping.entity";
import {Repository} from "typeorm";
import {CreateShippingDto} from "./dto/create-shipping.dto";

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
      @InjectRepository(Shipping)
      private readonly shippingRepository: Repository<Shipping>) {}

  async create(createShippingDto: CreateShippingDto): Promise<Shipping> {
    this.logger.log('Iniciando a criação da informação de envio.');

    try {
      const shipping = this.shippingRepository.create(createShippingDto);
      const savedShipping = await this.shippingRepository.save(shipping);
      this.logger.log(`Informação de envio criada com sucesso: ${savedShipping.id}`);
      return savedShipping;
    } catch (error) {
      this.logger.error('Erro ao criar informação de envio', error);
      throw new HttpException('Erro ao criar informação de envio.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Shipping[]> {
    return await this.shippingRepository.find({ relations: ['order'] });
  }

  async findOne(id: string): Promise<Shipping> {
    const shipping = await this.shippingRepository.findOne({ where: { id }, relations: ['order'] });
    if (!shipping) {
      throw new HttpException('Informação de envio não encontrada.', HttpStatus.NOT_FOUND);
    }
    return shipping;
  }

  async update(id: string, createShippingDto: Partial<CreateShippingDto>): Promise<Shipping> {
    this.logger.log(`Atualizando informação de envio com ID: ${id}`);

    const shipping = await this.shippingRepository.findOne({ where: { id: id } });
    if (!shipping) {
      this.logger.warn(`Informação de envio não encontrada: ${id}`);
      throw new HttpException('Informação de envio não encontrada.', HttpStatus.NOT_FOUND);
    }

    Object.assign(shipping, createShippingDto);

    try {
      const updatedShipping = await this.shippingRepository.save(shipping);
      this.logger.log(`Informação de envio atualizada com sucesso: ${updatedShipping.id}`);
      return updatedShipping;
    } catch (error) {
      this.logger.error('Erro ao atualizar informação de envio', error);
      throw new HttpException('Erro ao atualizar informação de envio.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo informação de envio com ID: ${id}`);

    const shipping = await this.shippingRepository.findOne({ where: { id: id } });
    if (!shipping) {
      this.logger.warn(`Informação de envio não encontrada: ${id}`);
      throw new HttpException('Informação de envio não encontrada.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.shippingRepository.remove(shipping);
      this.logger.log(`Informação de envio removida com sucesso: ${id}`);
    } catch (error) {
      this.logger.error('Erro ao remover informação de envio', error);
      throw new HttpException('Erro ao remover informação de envio.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}