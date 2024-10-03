import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Address} from "./entities/address.entity";
import {CustomerModule} from "../customer/customer.module";
import {Customer} from "../customer/entities/customer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Address,Customer]),
  CustomerModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [TypeOrmModule],
})
export class AddressModule {}
