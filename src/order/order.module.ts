import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderService} from "./order.service";
import {Order} from "./entities/order.entity";
import {OrderController} from "./order.controller";
import {PaymentModule} from "../payment/payment.module";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([Order]),
        ProductModule,
        PaymentModule],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}