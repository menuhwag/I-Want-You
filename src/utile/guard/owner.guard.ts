import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const userInfo = request.user;
        const params = request.params;

        if (!userInfo.uuid || !params.id) {
            throw new BadRequestException();
        }

        return userInfo.uuid === params.id;
    }
}
