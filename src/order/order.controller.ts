import { OrderService } from './order.service';
import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
    private readonly logger = new Logger(OrderController.name);

    constructor(private readonly orderService: OrderService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {

        this.logger.log('Iniciando a criação de um novo pedido');
        const order = await this.orderService.create(createOrderDto);
        this.logger.log(`Pedido criado com sucesso: ${order.id}`);

        return order;
    }

    @Get()
    async findAll(): Promise<Order[]> {

        this.logger.log('Buscando todos os pedidos');
        const orders = await this.orderService.findAll();
        this.logger.log(`Total de pedidos encontrados: ${orders.length}`);

        return orders;
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Order> {
        this.logger.log(`Buscando pedido com ID: ${id}`);
        try {
            const order = await this.orderService.findOne(id);
            this.logger.log(`Pedido encontrado: ${order.id}`);
            return order;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn(`Pedido com ID ${id} não encontrado`);
                throw error;
            }
            this.logger.error(`Erro ao buscar pedido com ID ${id}`, (error as Error).stack);
            throw new NotFoundException(`Erro ao buscar pedido com ID ${id}`);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log(`Iniciando a atualização do pedido com ID: ${id}`);
        try {
            const order = await this.orderService.update(id, createOrderDto);
            this.logger.log(`Pedido com ID ${id} atualizado com sucesso`);
            return order;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn(`Pedido com ID ${id} não encontrado para atualização`);
                throw error;
            }
            this.logger.error(`Erro ao atualizar pedido com ID ${id}`, (error as Error).stack);
            throw new NotFoundException(`Erro ao atualizar pedido com ID ${id}`);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        this.logger.log(`Iniciando a exclusão do pedido com ID: ${id}`);
        try {
            await this.orderService.delete(id);
            this.logger.log(`Pedido com ID ${id} excluído com sucesso`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn(`Pedido com ID ${id} não encontrado para exclusão`);
                throw error;
            }
            this.logger.error(`Erro ao remover pedido com ID ${id}`, (error as Error).stack);
            throw new NotFoundException(`Erro ao remover pedido com ID ${id}`);
        }
    }
}