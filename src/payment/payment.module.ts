import {Module} from '@nestjs/common';
import {PaymentService} from './payment.service';
import {PaymentController} from './payment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PaymentMethod} from "../payment-method/entities/payment-method.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
