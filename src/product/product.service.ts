import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductNotFoundException } from "../exceptions/ProductNotFoundException";

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        this.logger.log('Iniciando a criação de um novo produto');

        const product = this.productRepository.create(createProductDto);
        const savedProduct = await this.productRepository.save(product);

        this.logger.log(`Produto criado com sucesso: ${savedProduct.id}`);
        return savedProduct;
    }

    async findAll(): Promise<Product[]> {
        this.logger.log('Buscando todos os produtos');
        const products = await this.productRepository.find();
        this.logger.log(`Total de produtos encontrados: ${products.length}`);
        return products;
    }

    async findOne(id: number): Promise<Product> {
        this.logger.log(`Buscando produto com ID: ${id}`);
        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            this.logger.warn(`Produto com ID ${id} não encontrado`);
            throw new ProductNotFoundException(id);
        }

        this.logger.log(`Produto encontrado: ${product.id}`);
        return product;
    }

    async update(id: number, createProductDto: CreateProductDto): Promise<Product> {
        this.logger.log(`Iniciando a atualização do produto com ID: ${id}`);
        const existingProduct = await this.productRepository.findOneBy({ id });

        if (!existingProduct) {
            this.logger.warn(`Produto com ID ${id} não encontrado para atualização`);
            throw new ProductNotFoundException(id);
        }

        await this.productRepository.update(id, createProductDto);
        this.logger.log(`Produto com ID ${id} atualizado com sucesso`);

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Iniciando a exclusão do produto com ID: ${id}`);
        const existingProduct = await this.productRepository.findOneBy({ id });

        if (!existingProduct) {
            this.logger.warn(`Produto com ID ${id} não encontrado para exclusão`);
            throw new ProductNotFoundException(id);
        }

        await this.productRepository.delete(id);
        this.logger.log(`Produto com ID ${id} excluído com sucesso`);
    }
}