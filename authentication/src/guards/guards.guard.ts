import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('You dont have access to this resource');
    }
    try {
      const result = this.jwt.verify<{
        userId: string;
        iat: number;
        exp: number;
      }>(accessToken, {
        secret: process.env.JWT_SERCRET_KEY,
      });

      request.body.userId = result.userId;
      return true;
    } catch (error) {
      throw new UnauthorizedException('You dont have access to this resource');
    }
  }
}
