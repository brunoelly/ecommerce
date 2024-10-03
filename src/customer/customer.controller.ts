import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {CustomerResponseDto} from "./dto/customer-response.dto";

@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.create(createCustomerDto);
    }

    @Get()
    findAll(): Promise<CustomerResponseDto[]> {
        return this.customerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
        return this.customerService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
        return this.customerService.update(id, createCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.customerService.remove(id);
    }
}