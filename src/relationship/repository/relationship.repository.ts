import { IRelationshipRepository } from './irelationship.repository';
import { RelationshipEntity } from '../entities/relationship.entity';
import { FindOptionsSelect, FindOptionsSelectByString, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class RelationshipRepository implements IRelationshipRepository {
    constructor(@InjectRepository(RelationshipEntity) private relationshipRepository: Repository<RelationshipEntity>) {}
    async findOneByUUID(UUID: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity | null> {
        return await this.relationshipRepository.findOne({
            select,
            where: { uuid: UUID },
        });
    }
    async findOneByUsers(userA: string, userB: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity | null> {
        return await this.relationshipRepository.findOne({
            select,
            where: {
                user_a_uuid: userA,
                user_b_uuid: userB,
            },
        });
    }
    async findByUser(userA: string, select?: FindOptionsSelect<RelationshipEntity> | FindOptionsSelectByString<RelationshipEntity>): Promise<RelationshipEntity[] | null> {
        const relationship = await this.relationshipRepository.find({
            select,
            where: { user_a_uuid: userA },
        });
        if (!relationship) {
            return null;
        }
        return relationship;
    }
    async find(offset: number, limit: number): Promise<RelationshipEntity[] | null> {
        const relationship = await this.relationshipRepository.find({
            skip: offset,
            take: limit,
        });
        if (!relationship) {
            return null;
        }
        return relationship;
    }
    async save(UUID: string, userA: string, userB: string): Promise<void> {
        const relationship = new RelationshipEntity();

        relationship.uuid = UUID;
        relationship.user_a_uuid = userA;
        relationship.user_b_uuid = userB;

        await this.relationshipRepository.save(relationship);
    }
    async update(UUID: string, query: object): Promise<void> {
        const relationship = await this.relationshipRepository.findOne({ where: { uuid: UUID } });
        if (relationship instanceof RelationshipEntity) {
            for (const key in query) {
                relationship[key] = query[key];
            }
            await this.relationshipRepository.save(relationship);
        }
    }
    async delete(UUID: string): Promise<void> {
        await this.relationshipRepository.delete(UUID);
    }
}
