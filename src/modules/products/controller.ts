import { Controller, forwardRef, Get, HttpCode, Inject, Logger, Param } from '@nestjs/common';
import { BadRequestException } from 'src/exceptions';

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductQueryService } from './query.service';
import { GetProductResDto } from './dtos/get-product-res.dto';
import { ProductDto } from './dtos/product.dto';
import { Store } from '../store/schema';
import { StoreQueryService } from '../store/query.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productQueryService: ProductQueryService,
    @Inject(forwardRef(() => StoreQueryService))
    private readonly storeQueryService: StoreQueryService,
  ) {}

  private readonly logger = new Logger(ProductController.name);

  // GET /products
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('')
  async getProducts(): Promise<GetProductResDto & { product: ProductDto }> {
    this.logger.log('Fetching all products');
    const products = await this.productQueryService.getProductsWithStore();
    return {
      success: true,
      message: 'Products Found',
      product: products,
    };
  }

  // GET /products/:category
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get(':category')
  async getProductsByCategory(@Param('category') category: string): Promise<GetProductResDto & { products: ProductDto[] }> {
    const products = await this.productQueryService.getProductsByCategory(category);
    if (!products) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Products not found');
    }

    return {
      success: true,
      message: 'Products Found',
      products,
    };
  }

  // GET /products/stores
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('stores')
  async getStores(): Promise<GetProductResDto & { stores: Store[] }> {
    this.logger.log('Fetching all stores');
    const stores = await this.storeQueryService.getStoresForView();
    return {
      success: true,
      message: 'Stores Found',
      stores,
    };
  }

  // GET /products/:productId
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get(':productId')
  async getProduct(@Param('productId') productId: string): Promise<GetProductResDto & { product: ProductDto | any }> {
    const product = await this.productQueryService.getProductById(productId);
    if (!product) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Product not found');
    }

    return {
      success: true,
      message: 'Product Found',
      product,
    };
  }

  // GET /products/stores/:category
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('stores/:category')
  async getStoresByCategory(@Param('category') category: string): Promise<GetProductResDto & { stores: Store[] }> {
    const stores = await this.storeQueryService.getStoresByCategory([category]);
    if (!stores) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Stores not found');
    }

    return {
      success: true,
      message: 'Stores Found',
      stores,
    };
  }

  // GET /products/store/:storeId/products
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('store/:storeId/products')
  async getProductsByStoreId(@Param('storeId') storeId: string): Promise<GetProductResDto & { products: ProductDto[] }> {
    const products = await this.productQueryService.getProductsByStoreId(storeId);
    if (!products) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Products not found');
    }

    return {
      success: true,
      message: 'Products Found',
      products,
    };
  }
}
