import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Customer} from './entities/customer.entity';
import {CustomerNotFoundException} from '../exceptions/CustomerNotFoundException';
import {CreateCustomerDto} from './dto/create-customer.dto';
import {UserService} from "../user/user.service";
import {UserNotFoundException} from "../exceptions/UserNotFoundException";
import {UpdateCustomerDto} from "./dto/update-customer.dto";
import {CustomerResponseDto} from "./dto/customer-response.dto";

@Injectable()
export class CustomerService {
    private readonly logger = new Logger(CustomerService.name);

    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        private userService: UserService,
    ) {
    }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        this.logger.log('Iniciando a criação de um novo cliente');
        try {
            const user = await this.userService.findOneByEmail(createCustomerDto.email);
            if (!user) {
                this.logger.warn(`Usuário com ID ${createCustomerDto.userId} não encontrado`);
                throw new UserNotFoundException(createCustomerDto.userId);
            }
    
            const customer = this.customerRepository.create({
                ...createCustomerDto,
                user,
            });
    
            const savedCustomer = await this.customerRepository.save(customer);
            this.logger.log(`Cliente criado com sucesso: ${savedCustomer.id}`);
            return savedCustomer;
    
        } catch (error: any) {
            this.logger.error('Erro ao criar cliente', error.stack);
            throw error;
        }
    }

    async findAll(): Promise<CustomerResponseDto[]> {
        this.logger.log('Buscando todos os clientes');
        const customers = await this.customerRepository.find({relations: ['user', 'addresses']});

        this.logger.log(`Total de clientes encontrados: ${customers.length}`);
        return customers.map((customer: Customer) => this.mapCustomerToResponseDto(customer));
    }

    async findOne(id: string): Promise<CustomerResponseDto> {
        this.logger.log(`Buscando cliente com ID: ${id}`);
        const customer = await this.customerRepository.findOne({
            where: {id},
            relations: ['user', 'addresses'],
        });

        if (!customer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado`);
            throw new CustomerNotFoundException(id);
        }

        this.logger.log(`Cliente encontrado: ${customer.id}`);
        return this.mapCustomerToResponseDto(customer);
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
        this.logger.log(`Iniciando a atualização do cliente com ID: ${id}`);

        const existingCustomer = await this.customerRepository.findOne({
            where: {id},
            relations: ['user'],
        });

        if (!existingCustomer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado para atualização`);
            throw new CustomerNotFoundException(id);
        }

        Object.assign(existingCustomer, updateCustomerDto);
        await this.customerRepository.save(existingCustomer);

        this.logger.log(`Cliente com ID ${id} atualizado com sucesso`);

        return this.mapCustomerToResponseDto(existingCustomer);
    }

    async remove(id: string): Promise<void> {
        this.logger.log(`Iniciando a exclusão do cliente com ID: ${id}`);

        const existingCustomer = await this.customerRepository.findOneBy({id});

        if (!existingCustomer) {
            this.logger.warn(`Cliente com ID ${id} não encontrado para exclusão`);
            throw new CustomerNotFoundException(id);
        }

        await this.customerRepository.delete(id);
        this.logger.log(`Cliente com ID ${id} excluído com sucesso`);
    }

    public mapCustomerToResponseDto(customer: Customer): CustomerResponseDto {
        return {
            name: customer.name,
            email: customer.email,
            cpf: customer.cpf,
            phone: customer.phone,
            userId: customer.user ? customer.user.id : undefined,
            addresses: customer.addresses ?
                customer.addresses.map(address => ({
                    street: address.street,
                    number: address.number,
                    complement: address.complement || '',
                    zipCode: address.zipCode,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                })) : [],
            contacts: customer.contacts || [],
        };
    }
}