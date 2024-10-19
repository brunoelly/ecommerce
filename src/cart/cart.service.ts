import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Cart} from "./entities/cart.entity";
import {CartItem} from "../cart-item/entities/cart-item.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Product} from "../product/entities/product.entity";
import {CreateCartDto} from "./dto/create-cart.dto";
import {UpdateCartDto} from "./dto/update-cart.dto";

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
      @InjectRepository(Cart)
      private readonly cartRepository: Repository<Cart>,
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
      ) {}

  async addItem(createCartDto: CreateCartDto): Promise<Cart> {
    const { cartId, productId, quantity } = createCartDto;
    this.logger.log(`Adicionando item ao carrinho: Cart ID=${cartId}, Product ID=${productId}, Quantity=${quantity}`);

    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] });
    if (!cart) {
      this.logger.warn(`Carrinho não encontrado: ${cartId}`);
      throw new HttpException('Carrinho não encontrado.', HttpStatus.NOT_FOUND);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      this.logger.warn(`Produto não encontrado: ${productId}`);
      throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
    }

    const cartItem = new CartItem();
    cartItem.quantity = quantity;
    cartItem.cart = cart;
    cartItem.product = product;

    // Adiciona o item ao carrinho
    cart.cartItems.push(cartItem);

    try {
        await this.cartRepository.save(cart);
        this.logger.log(`Item adicionado com sucesso ao carrinho: ${cartId}`);
        return cart;
    } catch (error) {
      this.logger.error('Erro ao adicionar item ao carrinho', error);
      throw new HttpException('Erro ao adicionar item ao carrinho.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(cartId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] });
    if (!cart) {
      throw new HttpException('Carrinho não encontrado', HttpStatus.NOT_FOUND);
    }

    if (updateCartDto.cartItems) {
        cart.cartItems = updateCartDto.cartItems;
    }

    if (updateCartDto.customerId != undefined){
      cart.customer.id = updateCartDto.customerId;
    }

    try {
      return await this.cartRepository.save(cart);
    } catch (error) {
        throw new HttpException('Erro ao atualizar carrinho', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    this.logger.log(`Removendo item do carrinho: Cart ID=${cartId}, Item ID=${itemId}`);

    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems'] });
    if (!cart) {
      this.logger.warn(`Carrinho não encontrado: ${cartId}`);
      throw new HttpException('Carrinho não encontrado.', HttpStatus.NOT_FOUND);
    }

    const itemIndex = cart.cartItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item não encontrado no carrinho: ${itemId}`);
      throw new HttpException('Item não encontrado no carrinho.', HttpStatus.NOT_FOUND);
    }

    cart.cartItems.splice(itemIndex, 1);

    try {
      await this.cartRepository.save(cart);
      this.logger.log(`Item removido com sucesso do carrinho: ${cartId}`);
      return cart;
    } catch (error) {
      this.logger.error('Erro ao remover item do carrinho', error);
      throw new HttpException('Erro ao remover item do carrinho.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async clearCart(cartId: string): Promise<void> {
    this.logger.log(`Limpando o carrinho: Cart ID=${cartId}`);

    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['cartItems', 'customer'] });
    if (!cart) {
      this.logger.warn(`Carrinho não encontrado: ${cartId}`);
      throw new HttpException('Carrinho não encontrado.', HttpStatus.NOT_FOUND);
    }

    cart.cartItems = [];

    try {
      await this.cartRepository.save(cart);
      this.logger.log(`Carrinho limpo com sucesso: ${cartId}`);
    } catch (error) {
      this.logger.error('Erro ao limpar o carrinho', error);
      throw new HttpException('Erro ao limpar o carrinho.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}