import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import {UserModule} from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Customer]),
  UserModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [TypeOrmModule],
})
export class CustomerModule {}