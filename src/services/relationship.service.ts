import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { UpdateRelationshipDto } from '../dto/update-relationship.dto';
import { RelationshipEntity } from '../entities/relationship.entity';

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

  public async findAllByUser(userUUID: string) {
    const relationship = await this.relationshipRepository.find({where : { user_a_uuid : userUUID }});
    if (!relationship) {
      throw new NotFoundException();
    }
    return relationship;
  }

  public async findOneByUUID(id: string) {
    const relationship = await this.relationshipRepository.findOne({where: {uuid : id}});
    if (!relationship) {
      throw new NotFoundException();
    }
    return relationship;
  }

  public async findOneByUser(userA_UUID: string, userB_UUID: string) {
    const relationship = await this.relationshipRepository.findOne({where:{user_a_uuid:userA_UUID, user_b_uuid:userB_UUID}});
    if (!relationship) {
      throw new NotFoundException();
    }
    return relationship;
  }

  public async update(id: string, updateRelDto: UpdateRelationshipDto) {
    const relationship = await this. findOneByUUID(id);
    for (const key in Object(updateRelDto)) {
      relationship[key] = updateRelDto[key];
    }
    return await this.relationshipRepository.save(relationship);
  }

  public async remove(id: string) {
    const relationship = await this.findOneByUUID(id);
    if (!relationship) {
      throw new NotFoundException();
    }
    try{
      await this.relationshipRepository.remove(relationship);
    }catch {
      throw new ConflictException();
    }
  }

  private async saveRelationship(myUUID: string, friendUUID: string, relation: 'FRIEND' | 'COWORKER' | 'FAMILY' = 'FRIEND') {
    const relationship = new RelationshipEntity();
    relationship.uuid = ulid();
    relationship.profile_blocked = false;
    relationship.user_blocked = false;
    relationship.user_a_uuid = myUUID;
    relationship.user_b_uuid = friendUUID;
    relationship.relationship = relation;
    await this.relationshipRepository.save(relationship);
    return 'Create Relationship';
  }
}
