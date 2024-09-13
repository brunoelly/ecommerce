import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CustomerModule} from './customer/customer.module';
import {Customer} from './customer/entities/customer.entity';
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
import { AddressModule } from './address/address.module';
import { ContactModule } from './contact/contact.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [Customer],
            synchronize: true,
        }),
        CustomerModule,
        OrderItemModule,
        CategoryModule,
        CartModule,
        CartItemModule,
        PaymentModule,
        ShippingModule,
        UserModule,
        ReviewModule,
        WishlistModule,
        WishlistItemModule,
        DiscountModule,
        AddressModule,
        ContactModule,
        PaymentMethodModule,
    ],
})
export class AppModule {}