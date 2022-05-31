import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private logger: Logger, @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
        this.logger = new Logger(RolesGuard.name);
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const id = user.id;
        const userRole = await this.getUserRole(id);
        this.logger.debug(userRole);
        const roles = this.reflector.getAllAndMerge<string[]>('roles', [context.getHandler(), context.getClass()]);
        return roles?.includes(userRole) ?? true;
    }
    private async getUserRole(id: string): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException();
        }
        return user.role;
    }
}
