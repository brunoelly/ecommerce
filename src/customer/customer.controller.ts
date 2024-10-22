import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerResponseDto } from "./dto/customer-response.dto";

@ApiTags('customers')
@Controller('/api/v1/customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo cliente' })
    @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
        const customer = await this.customerService.create(createCustomerDto);
        return this.customerService.mapCustomerToResponseDto(customer);
    }

    @Get()
    @ApiOperation({ summary: 'Buscar todos os clientes' })
    @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso.', type: [CustomerResponseDto] })
    @ApiResponse({ status: 500, description: 'Erro no servidor' })
    async findAll(): Promise<CustomerResponseDto[]> {
        return this.customerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um cliente por ID' })
    @ApiResponse({ status: 200, description: 'Cliente encontrado com sucesso.', type: CustomerResponseDto })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
        return this.customerService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um cliente existente' })
    @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.', type: CustomerResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async update(@Param('id') id: string, @Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
        return this.customerService.update(id, createCustomerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover um cliente' })
    @ApiResponse({ status: 204, description: 'Cliente excluído com sucesso.' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.customerService.remove(id);
    }
}