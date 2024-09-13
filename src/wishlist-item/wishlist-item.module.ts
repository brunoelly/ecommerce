import { Module } from '@nestjs/common';
import { WishlistItemService } from './wishlist-item.service';
import { WishlistItemController } from './wishlist-item.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {WishlistItem} from "./entities/wishlist-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem])],
  controllers: [WishlistItemController],
  providers: [WishlistItemService],
})
export class WishlistItemModule {}
