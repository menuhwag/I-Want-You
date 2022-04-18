import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { RelationshipEntity } from './entities/relationship.entity';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipEntity) private relationshipRepository: Repository<RelationshipEntity>,
  ){}
  public async create(myUUID: string, friendUUID: string, relation: 'FRIEND' | 'COWORKER' | 'FAMILY' = 'FRIEND') {
    // 이미 등록되어있는지 확인 checkExists
    const relationship = await this.relationshipRepository.findOne({where: {user_a_uuid : myUUID, user_b_uuid : friendUUID}});
    if (relationship) {
      throw new BadRequestException();
    }
    return await this.saveRelationship(myUUID, friendUUID, relation);
  }

  public async findAll() {
    return await this.relationshipRepository.find();
  }

  public async findAllByUUID(userUUID: string) {
    const relationship = await this.relationshipRepository.find({where : { user_a_uuid : userUUID }});
    if (!relationship) {
      throw new NotFoundException();
    }
    return relationship;
  }

  public async findOne(id: string) {
    const relationship = await this.relationshipRepository.findOne({where: {uuid : id}});
    if (!relationship) {
      throw new NotFoundException();
    }
    return relationship;
  }

  public async update(id: string, updateRelationshipDto: UpdateRelationshipDto) {
    return `This action updates a #${id} relationship`;
  }

  public async remove(id: string) {
    const relationship = await this.findOne(id);
    return await this.relationshipRepository.remove(relationship);
  }

  private async saveRelationship(myUUID: string, friendUUID: string, relation: 'FRIEND' | 'COWORKER' | 'FAMILY' = 'FRIEND') {
    const relationship = new RelationshipEntity();
    relationship.profile_blocked = false;
    relationship.user_blocked = false;
    relationship.user_a_uuid = myUUID;
    relationship.user_b_uuid = friendUUID;
    relationship.relationship = relation;
    await this.relationshipRepository.save(relationship);
    return 'Create Relationship';
  }
}
