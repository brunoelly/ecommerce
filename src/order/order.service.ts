import {HttpException, HttpStatus, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Order} from './entities/order.entity';
import {CreateOrderDto} from './dto/create-order.dto';
import {Product} from '../product/entities/product.entity';
import {OrderNotFoundException} from "../exceptions/OrderNotFoundException";
import {OrderItem} from "../order-item/entities/order-item.entity";

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log('Iniciando a criação de um novo pedido');

        try {
            const order = this.orderRepository.create(createOrderDto);
            const savedOrder = await this.orderRepository.save(order);
            this.logger.log(`Pedido criado com sucesso: ${savedOrder.id}`);
            return savedOrder;
        } catch (error) {
            this.logger.error('Erro ao criar pedido', error);
            throw new HttpException('Erro ao criar pedido.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Order[]> {
        this.logger.log('Buscando todos os pedidos');
        const orders = await this.orderRepository.find({ relations: ['products'] });
        this.logger.log(`Total de pedidos encontrados: ${orders.length}`);
        return orders;
    }

    async findOne(id: number): Promise<Order> {
        this.logger.log(`Buscando pedido com ID: ${id}`);
        const order = await this.orderRepository.findOne({ where: { id }, relations: ['orderItems'] });
        if (!order) {
            this.logger.warn(`Pedido não encontrado: ${id}`);
            throw new HttpException('Pedido não encontrado.', HttpStatus.NOT_FOUND);
        }
        return order;
    }

    async update(id: number, createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log(`Iniciando a atualização do pedido com ID: ${id}`);

        const existingOrder = await this.orderRepository.findOne({
            where: { id },
            relations: ['orderItems'],
        });

        if (!existingOrder) {
            this.logger.warn(`Pedido com ID ${id} não encontrado para atualização`);
            throw new OrderNotFoundException(id);
        }

        // Atualiza os detalhes do pedido
        this.logger.log(`Atualizando detalhes do pedido ${id}`);
        Object.assign(existingOrder, createOrderDto, { updatedAt: new Date() });

        const orderItems = await this.productRepository.find({
            where: { id: In(createOrderDto.ordersIds) },
        });

        if (orderItems.length === 0) {
            this.logger.warn('Nenhum produto encontrado para os IDs fornecidos durante a atualização');
            throw new NotFoundException('Nenhum produto encontrado para os IDs fornecidos.');
        }

        existingOrder.orderItems = orderItems.map(product => {
            const orderItem = new OrderItem();
            orderItem.product = product;
            orderItem.order = existingOrder;
            return orderItem;
        });

        // Salva o pedido atualizado
        const updatedOrder = await this.orderRepository.save(existingOrder);
        this.logger.log(`Pedido atualizado com sucesso: ${updatedOrder.id}`);

        return updatedOrder;
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Iniciando a exclusão do pedido com ID: ${id}`);

        const existingOrder = await this.orderRepository.findOne({ where: { id } });
        if (!existingOrder) {
            this.logger.warn(`Pedido com ID ${id} não encontrado para exclusão`);
            throw new OrderNotFoundException(id);
        }

        await this.orderRepository.delete(id);
        this.logger.log(`Pedido com ID ${id} excluído com sucesso`);
    }

    async cancelOrder(id: number): Promise<void> {
        this.logger.log(`Cancelando pedido com ID: ${id}`);

        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            this.logger.warn(`Pedido não encontrado para cancelamento: ${id}`);
            throw new HttpException('Pedido não encontrado.', HttpStatus.NOT_FOUND);
        }

        try {
            await this.orderRepository.remove(order);
            this.logger.log(`Pedido cancelado com sucesso: ${id}`);
        } catch (error) {
            this.logger.error('Erro ao cancelar pedido', error);
            throw new HttpException('Erro ao cancelar pedido.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}