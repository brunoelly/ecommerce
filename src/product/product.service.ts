import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {ProductNotFoundException} from "../exceptions/ProductNotFoundException";

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async create(productData: Product): Promise<Product> {
        this.logger.log('Iniciando a criação do produto.');

        // Validação do nome do produto
        const existingProduct = await this.productRepository.findOne({ where: { name: productData.name } });
        if (existingProduct) {
            this.logger.warn(`Produto já cadastrado: ${productData.name}`);
            throw new HttpException('Produto já cadastrado.', HttpStatus.BAD_REQUEST);
        }

        try {
            const product = this.productRepository.create(productData);
            const savedProduct = await this.productRepository.save(product);
            this.logger.log(`Produto criado com sucesso: ${savedProduct.id}`);
            return savedProduct;
        } catch (error) {
            this.logger.error('Erro ao criar produto', error);
            throw new HttpException('Erro ao criar produto.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    async update(id: number, productData: Partial<Product>): Promise<Product> {
        this.logger.log(`Atualizando produto com ID: ${id}`);

        const product = await this.productRepository.findOne({ where: { id: productData.id } });
        if (!product) {
            this.logger.warn(`Produto não encontrado: ${id}`);
            throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
        }

        Object.assign(product, productData); // Atualiza os dados do produto

        try {
            const updatedProduct = await this.productRepository.save(product);
            this.logger.log(`Produto atualizado com sucesso: ${updatedProduct.id}`);
            return updatedProduct;
        } catch (error) {
            this.logger.error('Erro ao atualizar produto', error);
            throw new HttpException('Erro ao atualizar produto.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Removendo produto com ID: ${id}`);

        const product = await this.productRepository.findOne({ where: { id: id } });
        if (!product) {
            this.logger.warn(`Produto não encontrado: ${id}`);
            throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
        }

        try {
            await this.productRepository.remove(product);
            this.logger.log(`Produto removido com sucesso: ${id}`);
        } catch (error) {
            this.logger.error('Erro ao remover produto', error);
            throw new HttpException('Erro ao remover produto.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}