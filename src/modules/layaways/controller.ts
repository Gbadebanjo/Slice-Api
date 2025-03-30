import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LayawayQueryService } from './query.service';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../user/user.schema';
import { LayawayReqDto } from './dtos/layaway.req.dto';
import { LayawayResDto } from './dtos/layaway.res.dto';

@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@ApiTags('Layaways')
@Controller('layaways')
export class LayawayController {
  constructor(private readonly layawayQueryService: LayawayQueryService) {}

  @HttpCode(201)
  @Post()
  async createLayaway(@GetUser() user: UserDocument, @Body() layawayData: LayawayReqDto): Promise<LayawayResDto> {
    const data = {
      userId: user._id,
      ...layawayData,
    };
    await this.layawayQueryService.createLayaway(data);
    return {
      success: true,
      message: 'Layaway created successfully',
    };
  }
}
