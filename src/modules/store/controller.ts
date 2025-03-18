import { Body, Controller, Get, HttpCode, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException } from 'src/exceptions';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { StoreQueryService } from './query.service';
import { GetStoreResDto } from './dtos/getStore.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../user/user.schema';
import { ProfileQueryService } from '../profile/query.service';
import { StoreDto } from './dtos/store.dto';
import { StoreReqDto } from './dtos/store.req.dto';
import { Store } from './schema';
import { ProductResDto } from '../products/dtos/product.res.dto';
import { ProductDto } from '../products/dtos/product.dto';
import { ProductQueryService } from '../products/query.service';
import { Product } from '../products/schema';
import { AboutQueryService } from '../about/query';
import { AboutReqDto } from '../about/dtos/about.req.dto';

@ApiBearerAuth()
@ApiTags('Store')
@UseGuards(JwtUserAuthGuard)
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeQueryDervice: StoreQueryService,
    private readonly pofileQueryService: ProfileQueryService,
    private readonly productQueryService: ProductQueryService,
    private readonly aboutQueryService: AboutQueryService,
  ) {}

  private readonly logger = new Logger(StoreController.name);

  // GET /store
  @HttpCode(200)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Get('')
  async getStore(@GetUser() user: UserDocument): Promise<GetStoreResDto & { store: StoreDto }> {
    this.logger.log(`User ${user.email} is fetching store`);
    const profile = await this.pofileQueryService.getProfileByUserId(user._id);
    if (!profile) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Profile not found');
    }

    const store = await this.storeQueryDervice.getStoreByProfileId(profile._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }
    return {
      success: true,
      message: 'Store Found',
      store,
    };
  }

  // POST /store
  @HttpCode(201)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Post('create')
  async createStore(@GetUser() user: UserDocument, @Body() store: StoreReqDto): Promise<GetStoreResDto & { store: Store }> {
    this.logger.log(`User ${user.email} is creating store`);
    const profile = await this.pofileQueryService.getProfileByUserId(user._id);
    if (!profile) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Profile not found');
    }

    const storeBody = { ...store, profile: profile._id };

    const newStore = await this.storeQueryDervice.createStore(storeBody);
    return {
      success: true,
      message: 'Store Created',
      store: newStore,
    };
  }

  // PUT /store
  @HttpCode(200)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Put('update')
  async updateStore(@GetUser() user: UserDocument, @Body() store: StoreReqDto): Promise<GetStoreResDto & { store: Store }> {
    this.logger.log(`User ${user.email} is updating store`);
    const profile = await this.pofileQueryService.getProfileByUserId(user._id);
    if (!profile) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Profile not found');
    }

    const storeBody = { ...store, profile: profile._id };

    const updatedStore = await this.storeQueryDervice.updateStore(profile._id, storeBody);
    return {
      success: true,
      message: 'Store Updated',
      store: updatedStore,
    };
  }

  // Post /store/product
  @HttpCode(201)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Post('product')
  async createProduct(@GetUser() user: UserDocument, @Body() product: ProductDto): Promise<GetStoreResDto & { product: Product }> {
    const store = await this.storeQueryDervice.getStore(user._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }

    const newProduct = await this.productQueryService.createProduct(store._id, product);
    return {
      success: true,
      message: 'Product Created',
      product: newProduct,
    };
  }

  // GET /store/product
  @HttpCode(200)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Get('products/:productId')
  async getProduct(@GetUser() user: UserDocument, @Param('productId') id: string): Promise<GetStoreResDto & { product: ProductResDto }> {
    const store = await this.storeQueryDervice.getStore(user._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }

    const product = await this.productQueryService.getProductById(id);
    if (!product) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Product not found');
    }

    return {
      success: true,
      message: 'Product Found',
      product,
    };
  }

  // GET /store/products
  @HttpCode(200)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Get('products')
  async getProducts(@GetUser() user: UserDocument): Promise<GetStoreResDto & { products: Product[] }> {
    const store = await this.storeQueryDervice.getStore(user._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }

    const products = await this.productQueryService.getProductsByStoreId(store._id);
    if (!products) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Products not found');
    }

    return {
      success: true,
      message: 'Products Found',
      products,
    };
  }

  // // POST /store/about/create
  @HttpCode(201)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Post('about/create')
  async createAbout(@GetUser() user: UserDocument, @Body() about: AboutReqDto): Promise<GetStoreResDto> {
    const store = await this.storeQueryDervice.getStore(user._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }
    if (store.about) {
      throw BadRequestException.RESOURCE_ALREADY_EXISTS('About already exists');
    }

    const createAbout = await this.aboutQueryService.createAbout({ abouts: about.abouts });

    await this.storeQueryDervice.updateStore(store.profile._id, { about: createAbout._id });

    return {
      success: true,
      message: 'About Created',
    };
  }

  // PUT /store/about
  @HttpCode(200)
  @ApiOkResponse({
    type: GetStoreResDto,
  })
  @Put('about/update')
  async updateAbout(@GetUser() user: UserDocument, @Body() about: AboutReqDto): Promise<GetStoreResDto> {
    const store = await this.storeQueryDervice.getStore(user._id);
    if (!store) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found');
    }

    await this.aboutQueryService.updateAbout(store.about, { abouts: about.abouts });

    return {
      success: true,
      message: 'About Updated',
    };
  }
}
