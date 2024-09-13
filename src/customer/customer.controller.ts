import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import {CreateCustomerDto} from "./dto/create-customer.dto";

@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.create(createCustomerDto);
    }

    @Get()
    findAll(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Customer> {
        return this.customerService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.update(id, createCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.customerService.remove(id);
    }
}