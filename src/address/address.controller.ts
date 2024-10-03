import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Address } from './entities/address.entity';

@ApiTags('addresses')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso', type: Address })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retorna todos os endereços', type: [Address] })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retorna um endereço específico', type: Address })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso', type: Address })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Endereço excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}