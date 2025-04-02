import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from './repository';
import { CartDocument } from './cart.schema';
import { Identifier } from '../../shared/types';
import { ProductQueryService } from '../products/query.service';
import { CreateCartReqDto } from './dtos/createCart.req.dto';
import { BadRequestException } from '../../exceptions';
import { GeneralCartResDto } from './dtos/general.res.dto';

@Injectable()
export class CartQueryService {
  constructor(
    private readonly cartRepoitory: CartRepository,
    private readonly productService: ProductQueryService,
  ) {}

  async ItemModel(model: string, itemId: Identifier): Promise<any> {
    switch (model) {
      case 'Product':
        return this.productService.getProductById(itemId);
      default:
        return null;
    }
  }

  public async getCartBy(filter: Partial<CartDocument>): Promise<CartDocument | null> {
    return this.cartRepoitory.findOne(filter);
  }

  public async getCartById(id: string): Promise<CartDocument | null> {
    return this.cartRepoitory.findById(id);
  }

  public async createCart(cart: CreateCartReqDto): Promise<GeneralCartResDto> {
    try {
      const { userId, itemId, itemType, quantity } = cart;

      const item = await this.ItemModel(itemType, itemId);
      if (!item) {
        throw BadRequestException.RESOURCE_NOT_FOUND('Item not found');
      }

      if (item.status !== 'active') {
        throw BadRequestException.UNEXPECTED('Item is not available for cart');
      }

      // if (item.quantity < quantity) {
      //     throw BadRequestException.UNEXPECTED('Item quantity is not sufficient');
      // }

      const cartItem = await this.getCartBy({
        userId: new Types.ObjectId(userId),
        itemId: new Types.ObjectId(itemId),
        itemModel: itemType,
      });

      if (cartItem) {
        throw BadRequestException.UNEXPECTED('Item already exists in cart');
      }

      const cartToCreate = {
        userId: new Types.ObjectId(userId),
        itemId: new Types.ObjectId(itemId),
        itemModel: itemType,
        quantity,
      };

      await this.cartRepoitory.create(cartToCreate);

      if (!cart) {
        throw BadRequestException.UNEXPECTED('Error creating cart');
      }
      return {
        success: true,
        message: 'Cart created successfully',
      };
    } catch (error) {
      throw BadRequestException.UNEXPECTED(`Error creating cart: ${error?.message || error?.msg}`);
    }
  }

  public async updateCartItemQuantity(userId: string, cartItemId: string, type: string): Promise<GeneralCartResDto> {
    try {
      const cartItem = await this.getCartBy({
        userId: new Types.ObjectId(userId),
        _id: new Types.ObjectId(cartItemId),
      });
      if (!cartItem) {
        throw BadRequestException.RESOURCE_NOT_FOUND('Cart item not found');
      }

      const item = await this.ItemModel(cartItem.itemModel, cartItem.itemId);
      if (!item) {
        throw BadRequestException.RESOURCE_NOT_FOUND('Item not found');
      }

      if (type === 'increase') {
        cartItem.quantity += 1;
      } else if (type === 'decrease') {
        cartItem.quantity -= 1;
      } else {
        throw BadRequestException.UNEXPECTED('Invalid type');
      }

      await this.cartRepoitory.update(cartItemId, { quantity: cartItem.quantity });

      return {
        success: true,
        message: 'Cart item quantity updated successfully',
      };
    } catch (error) {
      throw BadRequestException.UNEXPECTED(`Error updating cart item quantity: ${error?.message || error?.msg}`);
    }
  }

  public async updateCart(id: string, cart: Partial<CartDocument>): Promise<CartDocument | null> {
    return this.cartRepoitory.update(id, cart);
  }

  public async deleteCartItem(id: string, userId: string): Promise<GeneralCartResDto> {
    const cartItem = await this.cartRepoitory.delete(id, userId);
    if (!cartItem) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Cart item not found');
    }

    return {
      success: true,
      message: 'Cart item deleted successfully',
    };
  }

  public async getCartItemsByUserId(userId: string): Promise<GeneralCartResDto & { items: CartDocument[] }> {
    const cartItems = await this.cartRepoitory.find({ userId: new Types.ObjectId(userId) });
    return {
      success: true,
      message: 'Cart items retrieved successfully',
      items: cartItems,
    };
  }
}
