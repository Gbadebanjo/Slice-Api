// External dependencies
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Internal dependencies
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from './dtos';

// Other modules dependencies
import { MailerService } from '../mailer/mailer.service';
import { Constants } from '../../shared/constants';

import { TokenQueryService } from '../token/token.query-service';
import { User } from '../user/user.schema';
import { UserQueryService } from '../user/user.query.service';

// Shared dependencies
import { BadRequestException } from '../../exceptions/bad-request.exception';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { forgotPasswordOtpEmail, otpEmail, registrationEmail } from '../mailer/mailer.constants';
import { VerifyAccountDto } from './dtos/verify.email.dto';
import { ResendEmailCodeReqDto } from './dtos/resend.email.code.req.dto';
import { ResetPasswordReqDto } from './dtos/reset.password.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userQueryService: UserQueryService,
    // private readonly workspaceQueryService: WorkspaceQueryService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly tokenQueryService: TokenQueryService,
  ) {}

  async signup(signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { password, firstName, lastName, accountType } = signupReqDto;
    // const workspaceName = 'Slice Dev WorkSpace';
    const email = signupReqDto.email.toLowerCase();

    const user = await this.userQueryService.findByEmail(email);
    if (user) {
      throw BadRequestException.RESOURCE_ALREADY_EXISTS(`User with email ${email} already exists`);
    }

    // const workspacePayload = {
    //   name: workspaceName,
    // };
    // const workspace = await this.workspaceQueryService.create(workspacePayload);

    // Hash password
    const saltOrRounds = this.SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const token = this.generateCode().toString();

    const userPayload: User = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      accountType,
      verified: false,
      verificationCode: null,
      resetToken: null,
      profilePicture: '',
      notificationSettings: {
        showMessageAlert: true,
        layawayReminder: true,
        dailyMission: true,
      },
      isInRecovery: false,
    };

    const createUser = await this.userQueryService.create(userPayload);

    await this.tokenQueryService.create({
      value: token,
      type: 'registration',
      userType: accountType,
      userId: createUser._id,
      expiresIn: new Date(Date.now() + Constants.tokenExpiry),
    });

    // Send email

    const mailBody = registrationEmail(createUser, token);

    await this.mailService.sendMail({
      to: email,
      subject: 'Welcome to Slice Buy',
      text: `Welcome to Slice Buy, ${firstName}!`,
      html: mailBody,
    });

    return {
      success: true,
      message: 'User created successfully',
    };
  }

  async verifyEmail(verifyAccountDto: VerifyAccountDto, tokenType: string, successMsg?: string): Promise<SignupResDto> {
    const { verificationCode } = verifyAccountDto;
    const email = verifyAccountDto.email.toLowerCase();

    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

    const findToken = await this.tokenQueryService.findToken({
      userId: user._id,
      type: tokenType,
      value: verificationCode,
      userType: user.accountType,
    });

    if (!findToken) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid verification code');
    }

    user.verified = true;

    await this.userQueryService.updateById(user._id, user);

    await this.tokenQueryService.deleteToken(findToken._id);

    return {
      success: true,
      message: successMsg || 'Email verified successfully',
    };
  }

  async resendVerificationCode(resendOtpDto: ResendEmailCodeReqDto): Promise<SignupResDto> {
    const email = resendOtpDto.email.toLowerCase();
    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.RESOURCE_NOT_FOUND('User Not Found');
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    // }

    if (user.verified) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Email already verified');
    }

    const token = this.generateCode().toString();

    const findToken = await this.tokenQueryService.findAToken({
      userId: user._id,
      type: 'registration',
      userType: user.accountType,
      value: '', // Just dummy not to break the code
    });

    if (findToken) {
      if (findToken.expiresIn > new Date()) {
        throw UnauthorizedException.UNAUTHORIZED_ACCESS('Verification code already sent');
      } else {
        await this.tokenQueryService.updateToken({
          _id: findToken._id,
          value: token,
          expiresIn: new Date(Date.now() + Constants.tokenExpiry),
          userId: user._id,
          type: 'registration',
          userType: user.accountType,
        });
        const mailBody = otpEmail(user.firstName, token);

        await this.mailService.sendMail({
          to: email,
          subject: 'Please verify your email address',
          text: `Welcome to Slice Buy, ${user.firstName}!`,
          html: mailBody,
        });

        return {
          success: true,
          message: 'Verification code sent successfully',
        };
      }
    } else {
      if (!user.firstName || !user.password) {
        throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid Account');
      }
      // await this.tokenQueryService.create({
      //   value: token,
      //   type: 'registration',
      //   userType: 'user',
      //   userId: user._id,
      //   expiresIn: new Date(Date.now() + Constants.tokenExpiry),
      // });

      // const mailBody = registrationEmail(user, token);

      // await this.mailService.sendMail({
      //   to: email,
      //   subject: 'Welcome to Slice Buy',
      //   text: `Welcome to Slice Buy, ${user.name}!`,
      //   html: mailBody,
      // });

      // return {
      //   success: true,
      //   message: 'Verification code sent successfully',
      // };

      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid verification code request');
    }
  }

  async passwordResetRequest(resetPasswordDto: ResendEmailCodeReqDto): Promise<SignupResDto> {
    const email = resetPasswordDto.email.toLowerCase();
    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.RESOURCE_NOT_FOUND('User Not Found');
    }

    const token = this.generateCode().toString();

    const findToken = await this.tokenQueryService.findAToken({
      userId: user._id,
      type: 'forgotPassword',
      userType: user.accountType,
      value: '', // Just dummy not to break the code
    });

    await this.userQueryService.updateById(user._id, {
      ...user,
      isInRecovery: true,
    });

    if (findToken) {
      if (findToken.expiresIn > new Date()) {
        throw UnauthorizedException.UNAUTHORIZED_ACCESS('Password reset code already sent');
      } else {
        await this.tokenQueryService.updateToken({
          _id: findToken._id,
          value: token,
          expiresIn: new Date(Date.now() + Constants.tokenExpiry),
          userId: user._id,
          type: 'forgotPassword',
          userType: user.accountType,
        });
        const mailBody = otpEmail(user.firstName, token);

        await this.mailService.sendMail({
          to: email,
          subject: 'Password Reset Request',
          text: `Hello, ${user.firstName}!`,
          html: mailBody,
        });

        return {
          success: true,
          message: 'Password reset code sent successfully',
        };
      }
    } else {
      await this.tokenQueryService.create({
        value: token,
        type: 'forgotPassword',
        userType: 'user',
        userId: user._id,
        expiresIn: new Date(Date.now() + Constants.tokenExpiry),
      });

      const mailBody = forgotPasswordOtpEmail(user.firstName || email, token);

      await this.mailService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Hello, ${user.firstName}!`,
        html: mailBody,
      });

      return {
        success: true,
        message: 'Password reset code sent successfully',
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordReqDto): Promise<SignupResDto> {
    const { password } = resetPasswordDto;
    const email = resetPasswordDto.email.toLowerCase();

    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.RESOURCE_NOT_FOUND('User Not Found');
    }

    if (!user.isInRecovery) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid password reset request');
    }

    const saltOrRounds = this.SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    await this.userQueryService.updateById(user._id, {
      ...user,
      password: hashedPassword,
      isInRecovery: false,
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  /**
   * Generates a random six digit OTP
   * @returns {number} - returns the generated OTP
   */
  generateCode(): number {
    const OTP_MIN = 100000;
    const OTP_MAX = 999999;
    return Math.floor(Math.random() * (OTP_MAX - OTP_MIN + 1)) + OTP_MIN;
  }

  async login(loginReqDto: LoginReqDto): Promise<LoginResDto> {
    const { password } = loginReqDto;

    const email = loginReqDto.email.toLowerCase();
    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

    if (!user.verified) {
      const token = this.generateCode().toString();

      const findToken = await this.tokenQueryService.findAToken({
        userId: user._id,
        type: 'registration',
        userType: user.accountType,
      });

      if (!findToken) {
        // Perhaps the token has been cleared by a cronJob supposedly running
        // So we create a new token for the user
        await this.tokenQueryService.create({
          value: token,
          type: 'registration',
          userType: user.accountType,
          userId: user._id,
          expiresIn: new Date(Date.now() + Constants.tokenExpiry),
        });
        const mailBody = otpEmail(user.firstName, token);

        await this.mailService.sendMail({
          to: email,
          subject: 'Please verify your email address',
          text: `Welcome to Slice Buy, ${user.firstName}!`,
          html: mailBody,
        });

        return {
          message: 'Email not verified',
          accessToken: null,
          user: null,
        };
      }

      await this.tokenQueryService.updateToken({
        _id: findToken._id,
        value: token,
        expiresIn: new Date(Date.now() + Constants.tokenExpiry),
        userId: user._id,
        type: 'registration',
        userType: user.accountType,
      });
      const mailBody = otpEmail(user.firstName, token);

      await this.mailService.sendMail({
        to: email,
        subject: 'Please verify your email address',
        text: `Welcome to Slice Buy, ${user.firstName}!`,
        html: mailBody,
      });

      return {
        message: 'Email not verified',
        accessToken: null,
        user: null,
      };
    }

    const payload: JwtUserPayload = {
      user: user._id,
      email: user.email,
      // code: user.registerCode,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    delete user.password;

    return {
      message: 'Login successful',
      accessToken,
      user,
    };
  }
}
