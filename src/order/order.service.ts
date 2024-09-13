import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Order} from './entities/order.entity';
import {CreateOrderDto} from './dto/create-order.dto';
import {Product} from '../product/entities/product.entity';
import {OrderNotFoundException} from "../exceptions/OrderNotFoundException";

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
        const products = await this.productRepository.find({
            where: { id: In(createOrderDto.productsIds) },
        });

        if (products.length === 0) {
            this.logger.warn('Nenhum produto encontrado para os IDs fornecidos');
            throw new NotFoundException('Nenhum produto encontrado para os IDs fornecidos.');
        }

        const order = this.orderRepository.create({
            ...createOrderDto,
            products,
        });

        const savedOrder = await this.orderRepository.save(order);
        this.logger.log(`Pedido criado com sucesso: ${savedOrder.id}`);

        return savedOrder;
    }

    async findAll(): Promise<Order[]> {
        this.logger.log('Buscando todos os pedidos');
        const orders = await this.orderRepository.find({ relations: ['products'] });
        this.logger.log(`Total de pedidos encontrados: ${orders.length}`);
        return orders;
    }

    async findOne(id: number): Promise<Order> {
        this.logger.log(`Buscando pedido com ID: ${id}`);
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!order) {
            this.logger.warn(`Pedido com ID ${id} não encontrado`);
            throw new OrderNotFoundException(id);
        }

        this.logger.log(`Pedido encontrado: ${order.id}`);
        return order;
    }

    async update(id: number, createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log(`Iniciando a atualização do pedido com ID: ${id}`);

        const existingOrder = await this.orderRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!existingOrder) {
            this.logger.warn(`Pedido com ID ${id} não encontrado para atualização`);
            throw new OrderNotFoundException(id);
        }

        // Atualiza os detalhes do pedido
        this.logger.log(`Atualizando detalhes do pedido ${id}`);
        existingOrder.description = createOrderDto.description;
        existingOrder.price = createOrderDto.price;
        existingOrder.totalAmount = createOrderDto.totalAmount;
        existingOrder.updatedAt = new Date();

        // Atualiza a lista de produtos
        const products = await this.productRepository.find({
            where: { id: In(createOrderDto.productsIds) },
        });

        // Verifica se os produtos existem
        if (products.length === 0) {
            this.logger.warn('Nenhum produto encontrado para os IDs fornecidos durante a atualização');
            throw new NotFoundException('Nenhum produto encontrado para os IDs fornecidos.');
        }

        existingOrder.products = products;

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
}