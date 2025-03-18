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
import { otpEmail, registrationEmail } from '../mailer/mailer.constants';
import { VerifyAccountDto } from './dtos/verify.email.dto';
import { ResendEmailCodeReqDto } from './dtos/resend.email.code.req.dto';

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
    const { email, password, name, accountType } = signupReqDto;
    // const workspaceName = 'Slice Dev WorkSpace';

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
      name,
      accountType,
      verified: false,
      verificationCode: null,
      resetToken: null,
    };

    const createUser = await this.userQueryService.create(userPayload);

    await this.tokenQueryService.create({
      value: token,
      type: 'registration',
      userType: 'user',
      userId: createUser._id,
      expiresIn: new Date(Date.now() + Constants.tokenExpiry),
    });

    // Send email

    const mailBody = registrationEmail(createUser, token);

    await this.mailService.sendMail({
      to: email,
      subject: 'Welcome to Slice Buy',
      text: `Welcome to Slice Buy, ${name}!`,
      html: mailBody,
    });

    return {
      success: true,
      message: 'User created successfully',
    };
  }

  async verifyEmail(verifyAccountDto: VerifyAccountDto): Promise<SignupResDto> {
    const { email, verificationCode } = verifyAccountDto;

    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

    const findToken = await this.tokenQueryService.findToken({
      userId: user._id,
      type: 'registration',
      value: verificationCode,
      userType: user.accountType,
    });

    if (!findToken) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid verification code');
    }

    user.verified = true;

    await this.userQueryService.updateById(user._id, user);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async resendVerificationCode(resendOtpDto: ResendEmailCodeReqDto): Promise<SignupResDto> {
    const { email, password } = resendOtpDto;
    const user = await this.userQueryService.findByEmail(email);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
    }

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
        const mailBody = otpEmail(user.name, token);

        await this.mailService.sendMail({
          to: email,
          subject: 'Please verify your email address',
          text: `Welcome to Slice Buy, ${user.name}!`,
          html: mailBody,
        });

        return {
          success: true,
          message: 'Verification code sent successfully',
        };
      }
    } else {
      if (!user.name || !user.password) {
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
    const { email, password } = loginReqDto;

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
        value: '', // Just dummy not to break the code
      });

      if (!findToken) {
        // Perhaps the token has been cleared by a cronJob supposedly running
        // So we create a new token for the user
        await this.tokenQueryService.create({
          value: token,
          type: 'registration',
          userType: 'user',
          userId: user._id,
          expiresIn: new Date(Date.now() + Constants.tokenExpiry),
        });
        const mailBody = otpEmail(user.name, token);

        await this.mailService.sendMail({
          to: email,
          subject: 'Please verify your email address',
          text: `Welcome to Slice Buy, ${user.name}!`,
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
      const mailBody = otpEmail(user.name, token);

      await this.mailService.sendMail({
        to: email,
        subject: 'Please verify your email address',
        text: `Welcome to Slice Buy, ${user.name}!`,
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
