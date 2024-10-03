import { Injectable } from '@nestjs/common';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';

@Injectable()
export class WishlistItemService {
  create(createWishlistItemDto: CreateWishlistItemDto) {
    return 'This action adds a new wishlistItem';
  }

  findAll() {
    return `This action returns all wishlistItem`;
  }

  findOne(id: string) {
    return `This action returns a #${id} wishlistItem`;
  }

  update(id: string, updateWishlistItemDto: UpdateWishlistItemDto) {
    return `This action updates a #${id} wishlistItem`;
  }

  remove(id: string) {
    return `This action removes a #${id} wishlistItem`;
  }
}
