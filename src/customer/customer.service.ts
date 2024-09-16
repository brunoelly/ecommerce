import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Customer} from './entities/customer.entity';
import {CustomerNotFoundException} from '../exceptions/CustomerNotFoundException';
import {CreateCustomerDto} from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
    private readonly logger = new Logger(CustomerService.name);

    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) {}

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        this.logger.log('Iniciando a criação de um novo cliente');

        const customer = this.customerRepository.create(createCustomerDto);
        const savedCustomer = await this.customerRepository.save(customer);

        this.logger.log(`Cliente criado com sucesso: ${savedCustomer.id}`);
        return savedCustomer;
    }

    async findAll(): Promise<Customer[]> {
        this.logger.log('Buscando todos os clientes');
        const customers = await this.customerRepository.find();
        this.logger.log(`Total de clientes encontrados: ${customers.length}`);
        return customers;
    }

    async findOne(id: number): Promise<Customer> {
        this.logger.log(`Buscando cliente com ID: ${id}`);
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado`);
            throw new CustomerNotFoundException(id);
        }

        this.logger.log(`Cliente encontrado: ${customer.id}`);
        return customer;
    }

    async update(id: number, createCustomerDto: CreateCustomerDto): Promise<Customer> {
        this.logger.log(`Iniciando a atualização do cliente com ID: ${id}`);

        const existingCustomer = await this.customerRepository.findOneBy({ id });

        if (!existingCustomer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado para atualização`);
            throw new CustomerNotFoundException(id);
        }

        await this.customerRepository.update(id, createCustomerDto);
        this.logger.log(`Cliente com ID ${id} atualizado com sucesso`);

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Iniciando a exclusão do cliente com ID: ${id}`);

        const existingCustomer = await this.customerRepository.findOneBy({ id });

        if (!existingCustomer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado para exclusão`);
            throw new CustomerNotFoundException(id);
        }

        await this.customerRepository.delete(id);
        this.logger.log(`Cliente com ID ${id} excluído com sucesso`);
    }
}