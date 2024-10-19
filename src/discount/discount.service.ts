import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Discount} from "./entities/discount.entity";
import {Repository} from "typeorm";
import {CreateDiscountDto} from "./dto/create-discount.dto";
import {UpdateDiscountDto} from "./dto/update-discount.dto";
import {Product} from "../product/entities/product.entity";

@Injectable()
export class DiscountService {
  private readonly logger = new Logger(DiscountService.name);

  constructor(
      @InjectRepository(Discount)
      private readonly discountRepository: Repository<Discount>
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    this.logger.log('Iniciando a criação do desconto.');

    // Validação do código do desconto
    const existingDiscount = await this.discountRepository.findOne({ where: { code: createDiscountDto.code } });
    if (existingDiscount) {
      this.logger.warn(`Código de desconto já cadastrado: ${createDiscountDto.code}`);
      throw new HttpException('Código de desconto já cadastrado.', HttpStatus.BAD_REQUEST);
    }

    try {
      const discount = this.discountRepository.create(createDiscountDto);
      const savedDiscount = await this.discountRepository.save(discount);
      this.logger.log(`Desconto criado com sucesso: ${savedDiscount.id}`);
      return savedDiscount;
    } catch (error) {
      this.logger.error('Erro ao criar desconto', error);
      throw new HttpException('Erro ao criar desconto.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async apply(code: string, orderTotal: number): Promise<number> {
    this.logger.log(`Aplicando desconto: ${code}`);

    const discount = await this.discountRepository.findOne({ where: { code } });
    if (!discount) {
      this.logger.warn(`Código de desconto inválido: ${code}`);
      throw new HttpException('Código de desconto inválido.', HttpStatus.BAD_REQUEST);
    }

    // Aplica o desconto ao total do pedido
    const newTotal = orderTotal - discount.amount;
    this.logger.log(`Desconto aplicado. Novo total: ${newTotal}`);
    return newTotal; // Retorna o novo total
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository.find();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      this.logger.warn(`Desconto não encontrado: ${id}`);
      throw new HttpException('Desconto não encontrado.', HttpStatus.NOT_FOUND);
    }
    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    this.logger.log(`Atualizando desconto ID=${id}`);

    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      this.logger.warn(`Desconto não encontrado: ${id}`);
      throw new HttpException('Desconto não encontrado.', HttpStatus.NOT_FOUND);
    }

    // Atualiza as propriedades do desconto
    if (updateDiscountDto.code) {
      discount.code = updateDiscountDto.code;
    }
    if (updateDiscountDto.amount) {
      discount.amount = updateDiscountDto.amount;
    }
    if (updateDiscountDto.productId) {
      discount.product = { id: updateDiscountDto.productId } as Product;
    }

    try {
      return await this.discountRepository.save(discount);
    } catch (error) {
      this.logger.error('Erro ao atualizar desconto', error);
      throw new HttpException('Erro ao atualizar desconto.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo desconto com ID: ${id}`);

    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      this.logger.warn(`Desconto não encontrado: ${id}`);
      throw new HttpException('Desconto não encontrado.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.discountRepository.remove(discount);
      this.logger.log(`Desconto removido com sucesso: ${id}`);
    } catch (error) {
      this.logger.error('Erro ao remover desconto', error);
      throw new HttpException('Erro ao remover desconto.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}