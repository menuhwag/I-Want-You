import { Injectable } from '@nestjs/common';
import { RelationshipService } from '../services/relationship.service';

@Injectable()
export class FriendsService {
  constructor(
    private relationshipService: RelationshipService
  ){}

  public async add(myUUID: string, friendUUID: string) {
    return await this.relationshipService.create(myUUID, friendUUID);
  }

  public async findByUUID(uuid: string) {
    return await this.relationshipService.findAllByUUID(uuid);
  }
}
