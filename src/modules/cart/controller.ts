import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CartQueryService } from './query.service';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { GeneralCartResDto } from './dtos/general.res.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateCartReqDto } from './dtos/createCart.req.dto';
import { CartDocument } from './cart.schema';

@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartQueryService: CartQueryService) {}

  @HttpCode(200)
  @ApiOkResponse({
    type: GeneralCartResDto,
    description: 'Create Cart',
  })
  @Post('/add')
  async createCart(@GetUser() user, @Body() cartData: CreateCartReqDto): Promise<GeneralCartResDto> {
    const cartDetail = { ...cartData, userId: user._id };
    return this.cartQueryService.createCart(cartDetail);
  }

  @HttpCode(200)
  @ApiOkResponse({
    type: GeneralCartResDto,
    description: 'Increase Cart Item',
  })
  @Post('/update-quantity')
  async updateCartItemQuantity(@GetUser() user, @Query('cartId') cartId: string, @Query('type') type: string): Promise<GeneralCartResDto> {
    return this.cartQueryService.updateCartItemQuantity(user._id, cartId, type);
  }

  @HttpCode(200)
  @ApiOkResponse({
    type: GeneralCartResDto,
    description: 'Get Cart Items',
  })
  @Get('/my')
  async getMyCart(@GetUser() user): Promise<GeneralCartResDto & { items: CartDocument[] }> {
    return this.cartQueryService.getCartItemsByUserId(user._id);
  }

  @HttpCode(204)
  @ApiOkResponse({
    type: GeneralCartResDto,
    description: 'Delete Cart Item',
  })
  @Post('/delete/:cartItemId')
  async deleteCartItem(@GetUser() user, @Param('cartItemId') cartItemId: string): Promise<GeneralCartResDto> {
    return this.cartQueryService.deleteCartItem(cartItemId, user._id);
  }
}
