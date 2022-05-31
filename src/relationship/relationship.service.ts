import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RelationshipEntity } from './entities/relationship.entity';
import { IRelationshipRepository } from './repository/irelationship.repository';

@Injectable()
export class RelationshipService {
    constructor(@Inject('RelationshipRepository') private relationshipRepository: IRelationshipRepository) {}
    public async create(userA: string, userB: string): Promise<void> {
        const relationship = await this.relationshipRepository.findOneByUsers(userA, userB);
        if (relationship) {
            throw new BadRequestException();
        }
        await this.relationshipRepository.save(userA, userB);
    }

    public async findAll(offset: number, limit: number): Promise<RelationshipEntity[] | null> {
        return await this.relationshipRepository.findAll(offset, limit);
    }

    public async findAllByUser(userA: string): Promise<RelationshipEntity[] | null> {
        const relationship = await this.relationshipRepository.findByUser(userA);
        if (!relationship) {
            throw new NotFoundException();
        }
        return relationship;
    }

    public async findOneByUUID(id: string): Promise<RelationshipEntity | null> {
        const relationship = await this.relationshipRepository.findOneByUUID(id);
        if (!relationship) {
            throw new NotFoundException();
        }
        return relationship;
    }

    public async findOneByUsers(userA: string, userB: string): Promise<RelationshipEntity | null> {
        const relationship = await this.relationshipRepository.findOneByUsers(userA, userB);
        if (!relationship) {
            throw new NotFoundException();
        }
        return relationship;
    }

    public async update(id: string, userUUID: string, query: object): Promise<void> {
        const relationship = await this.relationshipRepository.findOneByUUID(id);
        if (!relationship) {
            throw new NotFoundException();
        }
        if (relationship.user_a_uuid !== userUUID) {
            throw new UnauthorizedException();
        }
        await this.relationshipRepository.update(id, query);
    }

    public async remove(id: string, userUUID: string): Promise<void> {
        const relationship = await this.relationshipRepository.findOneByUUID(id);
        if (!relationship) {
            throw new NotFoundException();
        }
        if (relationship.user_a_uuid !== userUUID) {
            throw new UnauthorizedException();
        }
        await this.relationshipRepository.delete(id);
    }
}
