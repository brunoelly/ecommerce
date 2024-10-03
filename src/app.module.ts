import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CustomerModule} from './customer/customer.module';
import {OrderItemModule} from './order-item/order-item.module';
import {CategoryModule} from './category/category.module';
import {CartModule} from './cart/cart.module';
import {CartItemModule} from './cart-item/cart-item.module';
import {PaymentModule} from './payment/payment.module';
import {ShippingModule} from './shipping/shipping.module';
import {UserModule} from './user/user.module';
import {ReviewModule} from './review/review.module';
import {WishlistModule} from './wishlist/wishlist.module';
import {WishlistItemModule} from './wishlist-item/wishlist-item.module';
import {DiscountModule} from './discount/discount.module';
import {AddressModule} from './address/address.module';
import {ContactModule} from './contact/contact.module';
import {PaymentMethodModule} from './payment-method/payment-method.module';
import {Order} from "./order/entities/order.entity";
import {Product} from "./product/entities/product.entity";
import {Address} from "./address/entities/address.entity";
import {WishlistItem} from "./wishlist-item/entities/wishlist-item.entity";
import {Wishlist} from "./wishlist/entities/wishlist.entity";
import {User} from "./user/entities/user.entity";
import {Shipping} from "./shipping/entities/shipping.entity";
import {Review} from "./review/entities/review.entity";
import {PaymentMethod} from "./payment-method/entities/payment-method.entity";
import {Payment} from "./payment/entities/payment.entity";
import {OrderItem} from "./order-item/entities/order-item.entity";
import {Discount} from "./discount/entities/discount.entity";
import {Customer} from "./customer/entities/customer.entity";
import {Contact} from "./contact/entities/contact.entity";
import {Category} from "./category/entities/category.entity";
import {CartItem} from "./cart-item/entities/cart-item.entity";
import {Cart} from "./cart/entities/cart.entity";
import {OrderModule} from "./order/order.module";
import {ProductModule} from "./product/product.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [Address,
                Cart,
                CartItem,
                Category,
                Contact,
                Customer,
                Discount,
                Order,
                OrderItem,
                Payment,
                PaymentMethod,
                Product,
                Review,
                Shipping,
                User,
                Wishlist,
                WishlistItem],
            synchronize: true,
        }),
        AddressModule,
        CartModule,
        CartItemModule,
        CategoryModule,
        ContactModule,
        CustomerModule,
        DiscountModule,
        OrderModule,
        OrderItemModule,
        PaymentModule,
        PaymentMethodModule,
        ProductModule,
        ReviewModule,
        ShippingModule,
        UserModule,
        WishlistModule,
        WishlistItemModule,
    ],
})
export class AppModule {}