import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { CartDocument } from './cart.schema';

@Injectable()
export class CartRepository {
  constructor(@InjectModel(DatabaseCollectionNames.CART) private readonly cartModel: Model<CartDocument>) {}

  public async find(filter: any): Promise<CartDocument[]> {
    return this.cartModel.find(filter).populate('itemId').lean();
  }

  public async findOne(filter: any): Promise<CartDocument | null> {
    return this.cartModel.findOne(filter).lean();
  }

  public async findById(id: string): Promise<CartDocument | null> {
    return this.cartModel.findById(id).lean();
  }

  public async create(cart: Partial<CartDocument>): Promise<CartDocument> {
    return this.cartModel.create(cart);
  }

  public async update(id: string, cart: Partial<CartDocument>): Promise<CartDocument | null> {
    return this.cartModel.findByIdAndUpdate(new Types.ObjectId(id), cart, { new: true }).lean();
  }

  public async delete(id: string, userId: string): Promise<CartDocument | null> {
    return this.cartModel
      .findByIdAndDelete(new Types.ObjectId(id), {
        userId: new Types.ObjectId(userId),
      })
      .lean();
  }
}
