import { AskEntity } from '../entities/ask.entity';

export interface IAskrepository {
    findAskedAll(user: string): Promise<AskEntity[] | null>;
    findAskingAll(user: string): Promise<AskEntity[] | null>;
    findAll(offset: number, limit: number): Promise<AskEntity[]>;
    findOneByUUID(id: string): Promise<AskEntity | null>;
    findOneByDetails(asking: string, asked: string, target: string): Promise<AskEntity | null>;
    save(asking: string, asked: string, target: string): Promise<void>;
    delete(id): Promise<void>;
}
