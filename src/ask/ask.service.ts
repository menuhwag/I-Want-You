import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AskEntity } from './entities/ask.entity';
import { IAskrepository } from './repository/iask.repository';

@Injectable()
export class AskService {
    constructor(@Inject('AskRepository') private askrepository: IAskrepository) {}
    async findAskedAll(user: string): Promise<AskEntity[]> {
        const ask = await this.askrepository.findAskedAll(user);
        if (!ask) {
            throw new NotFoundException();
        }
        return ask;
    }
    async findAskingAll(user: string): Promise<AskEntity[]> {
        const ask = await this.askrepository.findAskingAll(user);
        if (!ask) {
            throw new NotFoundException();
        }
        return ask;
    }
    async findAll(offset: number, limit: number): Promise<AskEntity[]> {
        return await this.askrepository.findAll(offset, limit);
    }
    async findOneByUUID(user, id): Promise<AskEntity> {
        const ask = await this.askrepository.findOneByUUID(id);
        if (!ask) {
            throw new NotFoundException();
        }
        if (ask.asking !== user) {
            throw new BadRequestException();
        }
        return ask;
    }
    async ask(askingUser: string, askedUser: string, targetUser: string): Promise<void> {
        const ask = await this.askrepository.findOneByDetails(askingUser, askedUser, targetUser);
        if (ask) {
            throw new BadRequestException('이미 요청되었습니다');
        }
        return await this.askrepository.save(askingUser, askedUser, targetUser);
    }
    async cancelAsk(user, id): Promise<void> {
        const ask = await this.askrepository.findOneByUUID(id);
        if (!ask) {
            throw new NotFoundException();
        }
        if (ask.asking !== user) {
            throw new BadRequestException();
        }
        return await this.askrepository.delete(id);
    }
}
