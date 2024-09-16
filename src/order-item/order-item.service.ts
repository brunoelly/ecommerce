import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrderItem} from "./entities/order-item.entity";
import {Repository} from "typeorm";

@Injectable()
export class OrderItemService {
  private readonly logger = new Logger(OrderItemService.name);

  constructor(
      @InjectRepository(OrderItem)
      private readonly orderItemRepository: Repository<OrderItem>) {}

  async create(orderItemData: OrderItem): Promise<OrderItem> {
    this.logger.log('Iniciando a criação do item do pedido.');

    try {
      const orderItem = this.orderItemRepository.create(orderItemData);
      const savedOrderItem = await this.orderItemRepository.save(orderItem);
      this.logger.log(`Item do pedido criado com sucesso: ${savedOrderItem.id}`);
      return savedOrderItem;
    } catch (error) {
      this.logger.error('Erro ao criar item do pedido', error);
      throw new HttpException('Erro ao criar item do pedido.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    this.logger.log(`Atualizando item do pedido com ID: ${id}`);

    const orderItem = await this.orderItemRepository.findOne({ where: { id: id } });
    if (!orderItem) {
      this.logger.warn(`Item do pedido não encontrado: ${id}`);
      throw new HttpException('Item do pedido não encontrado.', HttpStatus.NOT_FOUND);
    }

    Object.assign(orderItem, orderItemData);

    try {
      const updatedOrderItem = await this.orderItemRepository.save(orderItem);
      this.logger.log(`Item do pedido atualizado com sucesso: ${updatedOrderItem.id}`);
      return updatedOrderItem;
    } catch (error) {
      this.logger.error('Erro ao atualizar item do pedido', error);
      throw new HttpException('Erro ao atualizar item do pedido.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Removendo item do pedido com ID: ${id}`);

    const orderItem = await this.orderItemRepository.findOne({ where: { id: id } });
    if (!orderItem) {
      this.logger.warn(`Item do pedido não encontrado: ${id}`);
      throw new HttpException('Item do pedido não encontrado.', HttpStatus.NOT_FOUND);
    }

    try {
      await this.orderItemRepository.remove(orderItem);
      this.logger.log(`Item do pedido removido com sucesso: ${id}`);
    } catch (error) {
      this.logger.error('Erro ao remover item do pedido', error);
      throw new HttpException('Erro ao remover item do pedido.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}