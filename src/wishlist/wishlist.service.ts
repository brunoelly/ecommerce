import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Wishlist} from "./entities/wishlist.entity";
import {Repository} from "typeorm";
import {WishlistItem} from "../wishlist-item/entities/wishlist-item.entity";
import {CreateWishlistItemDto} from "../wishlist-item/dto/create-wishlist-item.dto";
import {CreateWishlistDto} from "./dto/create-wishlist.dto";
import {UpdateWishlistDto} from "./dto/update-wishlist.dto";

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
      @InjectRepository(Wishlist)
      private readonly wishlistRepository: Repository<Wishlist>,
      @InjectRepository(WishlistItem)
      private readonly wishlistItemRepository: Repository<WishlistItem>
) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = new Wishlist();
    wishlist.customer = { id: createWishlistDto.customerId } as any;

    try {
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      this.logger.error('Erro ao criar wishlist', error);
      throw new HttpException('Erro ao criar wishlist', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addItem(wishlistId: string, createWishlistItemDto: CreateWishlistItemDto): Promise<Wishlist> {
    this.logger.log(`Adicionando item à lista de desejos: Wishlist ID=${wishlistId}, Product ID=${createWishlistItemDto.productId}`);

    const wishlist = await this.wishlistRepository.findOne({ where: { id: wishlistId }, relations: ['wishListItems'] });
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    // Verifica se o item já está na lista
    const existingItem = wishlist.wishlistItems.find(item => item.productId === createWishlistItemDto.productId);
    if (existingItem) {
      this.logger.warn(`Produto já está na lista de desejos: ${createWishlistItemDto.productId}`);
      throw new HttpException('Produto já está na lista de desejos.', HttpStatus.BAD_REQUEST);
    }

    const wishlistItem = new WishlistItem();
    wishlistItem.productId = createWishlistItemDto.productId;
    wishlistItem.wishlist = wishlist;

    try {
      await this.wishlistRepository.save(wishlistItem);
      wishlist.wishlistItems.push(wishlistItem)

      await this.wishlistRepository.save(wishlist);
      this.logger.log(`Item adicionado com sucesso à lista de desejos: ${wishlistId}`);
      return wishlist;
    } catch (error) {
      this.logger.error('Erro ao adicionar item à lista de desejos', error);
      throw new HttpException('Erro ao adicionar item à lista de desejos.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({ relations: ['wishlistItems', 'customer'] });
  }

  async findOne(id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id }, relations: ['wishlistItems', 'customer'] });
    if (!wishlist) {
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }
    return wishlist;
  }

  async update(id: string, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    this.logger.log(`Atualizando wishlist ID=${id}`);

    const wishlist = await this.wishlistRepository.findOne({ where: { id } });
    if (!wishlist) {
      this.logger.warn(`Wishlist não encontrada: ${id}`);
      throw new HttpException('Wishlist não encontrada.', HttpStatus.NOT_FOUND);
    }

    // Atualiza as propriedades desejadas
    if (updateWishlistDto.customerId) {
      wishlist.customer = { id: updateWishlistDto.customerId } as any; // Atualiza o cliente
    }

    try {
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      this.logger.error('Erro ao atualizar wishlist', error);
      throw new HttpException('Erro ao atualizar wishlist', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeItem(wishlistId: string, itemId: string): Promise<Wishlist> {
    this.logger.log(`Removendo item da lista de desejos: Wishlist ID=${wishlistId}, Item ID=${itemId}`);

    const wishlist = await this.wishlistRepository.findOne({ where: { id: wishlistId}});
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    const itemIndex = wishlist.wishlistItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item não encontrado na lista de desejos: ${itemId}`);
      throw new HttpException('Item não encontrado na lista de desejos.', HttpStatus.NOT_FOUND);
    }

    wishlist.wishlistItems.splice(itemIndex, 1); // Remove o item

    try {
      await this.wishlistRepository.save(wishlist);
      this.logger.log(`Item removido com sucesso da lista de desejos: ${wishlistId}`);
      return wishlist;
    } catch (error) {
      this.logger.error('Erro ao remover item da lista de desejos', error);
      throw new HttpException('Erro ao remover item da lista de desejos.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(wishlistId: string): Promise<WishlistItem[]> {
    this.logger.log(`Buscando itens da lista de desejos: Wishlist ID=${wishlistId}`);

    const wishlist = await this.wishlistRepository.findOne({ where: { id: wishlistId } });
    if (!wishlist) {
      this.logger.warn(`Lista de desejos não encontrada: ${wishlistId}`);
      throw new HttpException('Lista de desejos não encontrada.', HttpStatus.NOT_FOUND);
    }

    return wishlist.wishlistItems;
  }
}