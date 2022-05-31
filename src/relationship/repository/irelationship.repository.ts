import { FindOptionsSelect, FindOptionsSelectByString } from 'typeorm';
import { RelationshipEntity } from '../entities/relationship.entity';

export interface IRelationshipRepository {
    findOneByUUID(UUID: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity | null>;
    findOneByUsers(userA: string, userB: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity | null>;
    findByUser(userA: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity[] | null>;
    findAll(offset: number, limit: number): Promise<RelationshipEntity[] | null>;
    save(userA: string, userB: string): Promise<void>;
    update(UUID: string, query: object): Promise<void>;
    delete(UUID: string): Promise<void>;
}
