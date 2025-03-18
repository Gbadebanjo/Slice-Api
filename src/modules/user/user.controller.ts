// External dependencies
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Logger, Post, Put, UseGuards } from '@nestjs/common';

// Internal dependencies
import { GetProfileResDto } from './dtos';
import { UserDocument } from './user.schema';

// Other modules dependencies
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { ProfileResDto } from '../profile/dtos/profile.res';
import { ProfileQueryService } from '../profile/query.service';
// import { Profile } from '../profile/schema';
import { UpdateProfileReqDto } from '../profile/dtos/update.profile.dto';
import { BadRequestException } from '../../exceptions';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtUserAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly profileQueryService: ProfileQueryService) {}

  private readonly logger = new Logger(UserController.name);

  // GET /user/me
  @HttpCode(200)
  @ApiOkResponse({
    type: GetProfileResDto,
  })
  @Get('me')
  async getFullAccess(@GetUser() user: UserDocument): Promise<GetProfileResDto> {
    this.logger.debug(`User ${user.email} requested their profile`);
    return {
      message: 'Profile retrieved successfully',
      user,
    };
  }

  @HttpCode(200)
  @ApiOkResponse({
    type: ProfileResDto,
  })
  @Get('profile/vendor')
  async getVendorProfile(@GetUser() user: UserDocument): Promise<ProfileResDto> {
    if (user.accountType !== 'vendor') {
      return {
        success: false,
        message: 'User is not a vendor',
        profile: null,
      };
    }

    const profile = await this.profileQueryService.getProfileByUserId(user._id);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      profile,
    };
  }

  @HttpCode(201)
  @ApiOkResponse({
    type: ProfileResDto,
  })
  @Post('profile/vendor')
  async createVendorProfile(@GetUser() user: UserDocument, @Body() profileDetail: UpdateProfileReqDto): Promise<ProfileResDto> {
    if (user.accountType !== 'vendor') {
      return {
        success: false,
        message: 'User is not a vendor',
        profile: null,
      };
    }

    const checkProfile = await this.profileQueryService.getProfileByUserId(user._id);

    if (checkProfile) {
      throw BadRequestException.RESOURCE_ALREADY_EXISTS('Profile already created');
    }

    const profile = await this.profileQueryService.createProfile(user._id, profileDetail);
    return {
      success: true,
      message: 'Profile created successfully',
      profile,
    };
  }

  @HttpCode(200)
  @ApiOkResponse({
    type: ProfileResDto,
  })
  @Put('profile/vendor')
  async updateVendorProfile(@GetUser() user: UserDocument, @Body() profileDetail: UpdateProfileReqDto): Promise<ProfileResDto> {
    if (user.accountType !== 'vendor') {
      return {
        success: false,
        message: 'User is not a vendor',
        profile: null,
      };
    }

    const profile = await this.profileQueryService.updateProfileByUserId(user._id, profileDetail);
    return {
      success: true,
      message: 'Profile updated successfully',
      profile,
    };
  }
}

// @ApiBearerAuth()
// @ApiTags('Vendor')
// @UseGuards(JwtVendorAuthGuard)
// @Controller('profile/')
