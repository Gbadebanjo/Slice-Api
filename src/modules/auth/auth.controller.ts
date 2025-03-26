import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from './dtos';

import { BadRequestException } from '../../exceptions/bad-request.exception';
import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { VerifyAccountDto } from './dtos/verify.email.dto';
import { VerifyEmailRes } from './dtos/verify.email.res.dto';
import { ResendEmailCodeRes } from './dtos/resend.email.code.res.dto';
import { ResendEmailCodeReqDto } from './dtos/resend.email.code.req.dto';
import { ResetPasswordReqDto } from './dtos/reset.password.dto';

@ApiBadRequestResponse({
  type: BadRequestException,
})
@ApiInternalServerErrorResponse({
  type: InternalServerErrorException,
})
@ApiUnauthorizedResponse({
  type: UnauthorizedException,
})
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/signup
  @ApiOkResponse({
    type: SignupResDto,
  })
  @HttpCode(200)
  @Post('signup')
  async signup(@Body(ValidationPipe) signupReqDto: SignupReqDto): Promise<SignupResDto> {
    return this.authService.signup(signupReqDto);
  }

  // POST /auth/verify-email
  @ApiOkResponse({
    type: VerifyEmailRes,
  })
  @HttpCode(200)
  @Post('verify-email')
  async verifyEmail(@Body(ValidationPipe) verifyAccountDto: VerifyAccountDto): Promise<VerifyEmailRes> {
    return this.authService.verifyEmail(verifyAccountDto, 'registration');
  }

  // POST /auth/resend-otp
  @ApiOkResponse({
    type: ResendEmailCodeRes,
  })
  @HttpCode(200)
  @Post('resend-otp')
  async resendOtp(@Body(ValidationPipe) resendOtp: ResendEmailCodeReqDto): Promise<ResendEmailCodeRes> {
    return this.authService.resendVerificationCode(resendOtp);
  }

  // POST /auth/login
  @ApiOkResponse({
    type: LoginResDto,
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body(ValidationPipe) loginReqDto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(loginReqDto);
  }

  // POST /auth/forgot-password
  @ApiOkResponse({
    type: ResendEmailCodeRes,
  })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body(ValidationPipe) passwordReset: ResendEmailCodeReqDto): Promise<SignupResDto> {
    return this.authService.passwordResetRequest(passwordReset);
  }

  // POST /auth/verify-forgot-password
  @ApiOkResponse({
    type: VerifyEmailRes,
  })
  @HttpCode(200)
  @Post('verify-forgot-password')
  async verifyForgotPasswordOtp(@Body(ValidationPipe) verifyAccountDto: VerifyAccountDto): Promise<VerifyEmailRes> {
    return this.authService.verifyEmail(verifyAccountDto, 'forgotPassword', 'Email verification successful, please reset your password');
  }

  // POST /auth/reset-password
  @ApiOkResponse({
    type: SignupResDto,
  })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body(ValidationPipe) resetPasswordReqDto: ResetPasswordReqDto): Promise<SignupResDto> {
    return this.authService.resetPassword(resetPasswordReqDto);
  }
}
