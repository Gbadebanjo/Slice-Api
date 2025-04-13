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

    const newProducts = products.map((product) => {
      const { store, ...productData } = product;
      return {
        ...productData,
        ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
        price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
        initialPrice: product.price,
      };
    });
    return {
      success: true,
      message: 'Products Found',
      product: newProducts,
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

    const newProducts = products.map((product) => {
      return {
        ...product,
        ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
        price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
        initialPrice: product.price,
      };
    });

    return {
      success: true,
      message: 'Products Found',
      products: newProducts,
    };
  }

  // GET /products/stores
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('stores/all')
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
  @Get('product/:productId')
  async getProduct(@Param('productId') productId: string): Promise<GetProductResDto & { product: ProductDto | any }> {
    const product = await this.productQueryService.getProductById(productId);
    if (!product) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Product not found');
    }

    const newProduct = {
      ...(product as any).toObject(),
      ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
      price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
      store: {
        storeName: product.store.profile.storeName,
        about: product.store.about,
        storeLogo: product.store.storelogo,
        rating: Math.floor(Math.random() * 5) + 2,
      },
    };

    return {
      success: true,
      message: 'Product Found',
      product: newProduct,
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

    const newStores = stores.map((store: any) => {
      return {
        storeName: store.profile.storeName,
        storeLogo: store.storelogo,
        rating: Math.floor(Math.random() * 5) + 2,
        storeId: store._id,
      };
    });

    return {
      success: true,
      message: 'Stores Found',
      stores: newStores as any,
    };
  }

  // GET /products/store/:storeId/products
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('store/:storeId/products')
  async getProductsByStoreId(@Param('storeId') storeId: string): Promise<GetProductResDto & { products: ProductDto[]; store: any }> {
    const products = await this.productQueryService.getProductsByStoreId(storeId);
    if (!products) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Products not found');
    }

    const newProducts = products.map((product) => {
      const { store, ...productData } = product;
      return {
        ...productData,
        ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
        price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
        initialPrice: product.price,
      };

      // return {
      //   name: product.name,
      //   ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
      //   price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
      //   initialPrice: product.price,
      //   images: product.images,
      //   description: product.description,
      //   productId: product._id,
      // };
    });

    return {
      success: true,
      message: 'Products Found',
      products: newProducts as any,
      store: {
        storeName: (products[0].store as any).profile.storeName,
        description: (products[0].store as any).profile.storeDescription,
        storeId: (products[0].store as any)._id,
        storeLogo: (products[0].store as any).storelogo,
        rating: Math.floor(Math.random() * 5) + 2,
      },
    };
  }

  @HttpCode(200)
  @ApiOkResponse({
    type: GetProductResDto,
  })
  @Get('recent/products')
  async getRecentProducts(): Promise<GetProductResDto & { products: ProductDto[] }> {
    const products = await this.productQueryService.getRecntProducts();
    if (!products) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Products not found');
    }

    const newProducts = products.map((product) => {
      const { store, ...productData } = product;
      return {
        ...productData,
        ratings: product.likes.length > 0 ? product.likes.length : Math.floor(Math.random() * 5) + 1,
        price: product.discountAvailable ? product.price - (product.price * product.discountValue) / 100 : product.price,
      };
    });

    return {
      success: true,
      message: 'Products',
      products: newProducts,
    };
  }
}
