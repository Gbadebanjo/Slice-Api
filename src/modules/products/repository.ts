import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { Identifier } from 'src/shared/types';
import { Product, ProductDocument } from './schema';
import { ProductDto } from './dtos/product.dto';
import { ProductResDto } from './dtos/product.res.dto';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(DatabaseCollectionNames.PRODUCT) private ProductModel: Model<ProductDocument>) {}

  public async find(filter: FilterQuery<ProductDocument>): Promise<Product[]> {
    return this.ProductModel.find(filter)
      .populate({
        path: 'store',
        populate: [
          {
            path: 'profile',
            select: 'storeName storeDescription phoneNumber',
          },
          {
            path: 'about',
            select: 'abouts',
          },
        ],
      })
      .lean();
  }

  public async findAll(): Promise<Product[]> {
    return this.ProductModel.find().lean();
  }

  public async getProductsWithStore(): Promise<ProductResDto[] | any> {
    return this.ProductModel.find()
      .populate({
        path: 'store',
        populate: {
          path: 'profile',
          select: '_id storeName storeDescription phoneNumber',
        },
      })
      .lean();
  }

  public async findById(id: Identifier): Promise<Product | ProductResDto | any> {
    return this.ProductModel.findById(new mongoose.Types.ObjectId(id))
      .populate({
        path: 'store',
        populate: {
          path: 'profile',
          select: 'storeName storeDescription phoneNumber',
        },
      })
      .exec();
  }

  public async findOne(filter: FilterQuery<ProductDocument>): Promise<ProductDto | null> {
    return this.ProductModel.findOne(filter).lean();
  }

  public async create(storeId: Identifier, product: ProductDto): Promise<Product> {
    const newProduct = { ...product, store: storeId };
    return this.ProductModel.create(newProduct);
  }
}
