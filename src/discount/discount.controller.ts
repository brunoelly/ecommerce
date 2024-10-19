import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {DiscountService} from './discount.service';
import {CreateDiscountDto} from './dto/create-discount.dto';
import {UpdateDiscountDto} from './dto/update-discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Post('apply') // Aplica um desconto usando o código
  apply(@Body() { code, orderTotal }: { code: string; orderTotal: number }) {
    return this.discountService.apply(code, orderTotal);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
