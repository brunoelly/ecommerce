import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Wishlist} from "./entities/wishlist.entity";
import {Repository} from "typeorm";
import {WishlistItem} from "../wishlist-item/entities/wishlist-item.entity";

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
      @InjectRepository(Wishlist)
      private readonly wishlistRepository: Repository<Wishlist>) {}

  async addItem(wishlistId: number, productId: number): Promise<Wishlist> {
    this.logger.log(`Adicionando item à lista de desejos: Wishlist ID=${wishlistId}, Product ID=${productId}`);

    const wishlist = await this.wishlistRepository.findOne(wishlistId);
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    // Verifica se o item já está na lista
    const existingItem = wishlist.items.find(item => item.productId === productId);
    if (existingItem) {
      this.logger.warn(`Produto já está na lista de desejos: ${productId}`);
      throw new HttpException('Produto já está na lista de desejos.', HttpStatus.BAD_REQUEST);
    }

    const wishlistItem = new WishlistItem();
    wishlistItem.productId = productId;
    wishlistItem.wishlistId = wishlistId;

    wishlist.items.push(wishlistItem); // Adiciona o item à lista de desejos

    try {
      await this.wishlistRepository.save(wishlist);
      this.logger.log(`Item adicionado com sucesso à lista de desejos: ${wishlistId}`);
      return wishlist;
    } catch (error) {
      this.logger.error('Erro ao adicionar item à lista de desejos', error);
      throw new HttpException('Erro ao adicionar item à lista de desejos.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeItem(wishlistId: number, itemId: number): Promise<Wishlist> {
    this.logger.log(`Removendo item da lista de desejos: Wishlist ID=${wishlistId}, Item ID=${itemId}`);

    const wishlist = await this.wishlistRepository.findOne(wishlistId);
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    const itemIndex = wishlist.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item não encontrado na lista de desejos: ${itemId}`);
      throw new HttpException('Item não encontrado na lista de desejos.', HttpStatus.NOT_FOUND);
    }

    wishlist.items.splice(itemIndex, 1); // Remove o item

    try {
      await this.wishlistRepository.save(wishlist);
      this.logger.log(`Item removido com sucesso da lista de desejos: ${wishlistId}`);
      return wishlist;
    } catch (error) {
      this.logger.error('Erro ao remover item da lista de desejos', error);
      throw new HttpException('Erro ao remover item da lista de desejos.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(wishlistId: number): Promise<WishlistItem[]> {
    this.logger.log(`Buscando itens da lista de desejos: Wishlist ID=${wishlistId}`);

    const wishlist = await this.wishlistRepository.findOne(wishlistId);
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    return wishlist.items; // Retorna os itens da lista de desejos
  }
}