import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Identifier } from 'src/shared/types';
import { ProductRepository } from './repository';
import { ProductDto } from './dtos/product.dto';
import { ProductResDto } from './dtos/product.res.dto';

@Injectable()
export class ProductQueryService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async getProducts() {
    return this.productRepository.findAll();
  }

  public async getProductsWithStore() {
    return this.productRepository.getProductsWithStore();
  }

  public async getProductsByCategory(category: string) {
    return this.productRepository.find({ $in: { category } });
  }

  public async getProductById(id: Identifier): Promise<ProductResDto | null> {
    return this.productRepository.findById(id);
  }

  public async getProductsByStoreId(storeId: Identifier) {
    return this.productRepository.find({ store: new mongoose.Types.ObjectId(storeId) });
  }

  public async createProduct(storeId: Identifier, product: ProductDto) {
    return this.productRepository.create(storeId, product);
  }
}
