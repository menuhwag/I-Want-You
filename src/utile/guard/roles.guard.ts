import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>){}
  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const uuid = user.uuid;
    const userRole = await this.getUserRole(uuid);
    console.log(userRole);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return roles?.includes(userRole) ?? true;
  }
  private async getUserRole(uuid: string): Promise<string>{
    const user = await this.userRepository.findOne({where: {uuid}});
    if (!user){
      throw new NotFoundException();
    }
    return user.role;
  }
}
