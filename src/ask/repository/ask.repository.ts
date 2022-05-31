import { IAskrepository } from './iask.repository';
import { AskEntity } from '../entities/ask.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class AskRepository implements IAskrepository {
    constructor(@InjectRepository(AskEntity) private askrepository: Repository<AskEntity>) {}
    async findAskedAll(user: string): Promise<AskEntity[] | null> {
        const ask = await this.askrepository.find({ where: { asked: user } });
        if (!ask) {
            return null;
        }
        return ask;
    }
    async findAskingAll(user: string): Promise<AskEntity[] | null> {
        const ask = await this.askrepository.find({ where: { asking: user } });
        if (!ask) {
            return null;
        }
        return ask;
    }
    async findAll(offset: number, limit: number): Promise<AskEntity[]> {
        const ask = await this.askrepository.find({ skip: offset, take: limit });
        return ask;
    }
    async findOneByUUID(id: string): Promise<AskEntity | null> {
        const ask = await this.askrepository.findOne({ where: { id } });
        if (!ask) {
            return null;
        }
        return ask;
    }
    async findOneByDetails(asking: string, asked: string, target: string): Promise<AskEntity | null> {
        const ask = await this.askrepository.findOne({
            where: {
                asking,
                asked,
                target,
            },
        });
        if (!ask) {
            return null;
        }
        return ask;
    }
    async save(asking: string, asked: string, target: string): Promise<void> {
        const ask = new AskEntity();
        ask.asking = asking;
        ask.asked = asked;
        ask.target = target;

        await this.askrepository.save(ask);
    }
    async delete(id): Promise<void> {
        await this.askrepository.delete(id);
    }
}
