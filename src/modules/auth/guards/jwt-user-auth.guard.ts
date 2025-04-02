import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { UnauthorizedException } from '../../../exceptions/unauthorized.exception';

@Injectable()
export class JwtUserAuthGuard extends AuthGuard('authUser') {
  JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError';

  TOKEN_EXPIRED_ERROR = 'TokenExpiredError';

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // // for example, call super.logIn(request) to establish a session.
    // super.logIn(context.switchToHttp().getRequest());
    // const request = context.switchToHttp().getRequest();

    // const { authorization } = request.headers;
    // if (!authorization && !request.cookies?.Authorization) {
    //   throw UnauthorizedException.UNAUTHORIZED_ACCESS('Authorization header is missing');
    // }

    // const token = authorization.split(' ')[1];
    // if (!token) {
    //   throw UnauthorizedException.UNAUTHORIZED_ACCESS('Token is missing from authorization header');
    // }
    // if (token === 'null' || token === 'undefined') {
    //   throw UnauthorizedException.UNAUTHORIZED_ACCESS('Token is invalid or expired');
    // }

    // request.user = token;
    // // You can also use the request object to perform additional checks or validations

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: Error, context: any, status: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info?.name === this.JSON_WEB_TOKEN_ERROR) {
      throw UnauthorizedException.JSON_WEB_TOKEN_ERROR();
    } else if (info?.name === this.TOKEN_EXPIRED_ERROR) {
      throw UnauthorizedException.TOKEN_EXPIRED_ERROR();
    } else if (info) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS(info.message);
    } else if (err) {
      throw err;
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
