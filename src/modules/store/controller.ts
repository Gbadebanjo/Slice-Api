import { Body, Controller, Get, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('Store')
@UseGuards(JwtUserAuthGuard)
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeQueryDervice: StoreQueryService,
    private readonly pofileQueryService: ProfileQueryService,
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

    const store = await this.storeQueryDervice.getStoreByProfileId(user._id);
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
  @Post('update')
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
}
