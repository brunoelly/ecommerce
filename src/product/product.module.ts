import {Module} from "@nestjs/common";
import {Product} from "./entities/product.entity";
import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [TypeOrmModule],
})
export class ProductModule {}