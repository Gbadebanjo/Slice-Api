// External dependencies
import * as bcrypt from 'bcryptjs';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, HttpCode, Logger, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from 'src/cloudinary/cloudinary.service';
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
import { BadRequestException, UnauthorizedException } from '../../exceptions';
import { ChangePasswordResDto } from './dtos/change-password.res,dto';
import { ChangePasswordReqDto } from './dtos/change-password.req.dto';
import { UserQueryService } from './user.query.service';
import { FileUploadReqDto } from './dtos/file-upload.req.dto';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtUserAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly profileQueryService: ProfileQueryService,
    private readonly userQueryService: UserQueryService,
    private readonly cloudinaryService: UploadService,
  ) {}

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

  // Change Password
  @HttpCode(200)
  @ApiOkResponse({
    type: ChangePasswordResDto,
  })
  @Post('change-password')
  async changePassword(@GetUser() user: UserDocument, @Body() passwords: ChangePasswordReqDto): Promise<ChangePasswordResDto> {
    const userData = await this.userQueryService.findById(user._id);
    const currentPasswordCompare = await bcrypt.compare(passwords.currentPassword, userData.password);

    if (!currentPasswordCompare) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Current password is incorrect');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(passwords.newPassword, saltOrRounds);

    await this.userQueryService.updateById(user._id, { ...user, password: hashedPassword });

    return {
      message: 'Password updated successfully',
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
  @Post('profile/vendor/create')
  async createVendorProfile(@GetUser() user: UserDocument, @Body() profileDetail: UpdateProfileReqDto): Promise<ProfileResDto> {
    if (user.accountType !== 'vendor') {
      return {
        success: false,
        message: 'User is not a vendor',
        profile: null,
      };
    }

    const checkProfile = await this.profileQueryService.getProfile(user._id);

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

  @HttpCode(200)
  @ApiOkResponse({
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        },
      },
    },
  })
  @Post('upload-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // 👈 Tells Swagger it accepts multipart
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 👈 Required for file uploads
        },
      },
    },
  })
  async upload(@GetUser() user, @UploadedFile() fileData: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.cloudinaryService.uploadImage(fileData);

    if (result.secure_url) {
      await this.userQueryService.updateById(user._id, { ...user, profilePicture: result.secure_url });
    }
    return {
      url: result.secure_url,
    };
  }
}

// @ApiBearerAuth()
// @ApiTags('Vendor')
// @UseGuards(JwtVendorAuthGuard)
// @Controller('profile/')
