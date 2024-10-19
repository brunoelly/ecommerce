import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    private readonly logger = new Logger(ProductController.name);

    constructor(private readonly productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() product: Product): Promise<Product> {
        this.logger.log('Iniciando a criação de um novo produto');
        const createdProduct = await this.productService.create(product);
        this.logger.log(`Produto criado com sucesso: ${createdProduct.id}`);
        return createdProduct;
    }

    @Get()
    async findAll(): Promise<Product[]> {
        this.logger.log('Buscando todos os produtos');
        const products = await this.productService.findAll();
        this.logger.log(`Total de produtos encontrados: ${products.length}`);
        return products;
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        this.logger.log(`Buscando produto com ID: ${id}`);
        try {
            const product = await this.productService.findOne(id);
            this.logger.log(`Produto encontrado: ${product.id}`);
            return product;
        } catch (error) {
            this.logger.warn(`Produto com ID ${id} não encontrado`);
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() product: Product): Promise<Product> {
        this.logger.log(`Iniciando a atualização do produto com ID: ${id}`);
        try {
            const updatedProduct = await this.productService.update(id, product);
            this.logger.log(`Produto com ID ${id} atualizado com sucesso`);
            return updatedProduct;
        } catch (error) {
            this.logger.warn(`Produto com ID ${id} não encontrado para atualização`);
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        this.logger.log(`Iniciando a exclusão do produto com ID: ${id}`);
        try {
            await this.productService.remove(id);
            this.logger.log(`Produto com ID ${id} excluído com sucesso`);
        } catch (error) {
            this.logger.warn(`Produto com ID ${id} não encontrado para exclusão`);
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
    }
}