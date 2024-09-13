import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Customer} from "../customer/entities/customer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
