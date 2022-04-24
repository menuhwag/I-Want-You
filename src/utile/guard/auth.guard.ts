import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = this.validateRequest(request);
    return true;
  }

  private validateRequest(request: Request) {
    const authorization = request.headers.authorization;
    if (!authorization){
      throw new UnauthorizedException();
    }
    const jwtString = authorization.split('Bearer ')[1];
    const user = this.authService.verify(jwtString);

    return user;
  }
}
