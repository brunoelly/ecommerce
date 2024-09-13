import {Module} from "@nestjs/common";
import {Product} from "./product.entity";
import {ProductController} from "./product.controller";
import {ProductService} from "./product.service";

@Module({
    imports: [Product],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}