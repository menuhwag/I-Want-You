import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRelationshipDto } from '../relationship/dto/update-relationship.dto';
import { RelationshipService } from '../relationship/relationship.service';

@Injectable()
export class FriendsService {
    constructor(private relationshipService: RelationshipService) {}

    public async add(myUUID: string, friendUUID: string) {
        return await this.relationshipService.create(myUUID, friendUUID);
    }

    public async findByUser(user: string) {
        return await this.relationshipService.findAllByUser(user);
    }

    public async findMyFriend(myUUID: string, friendUUID: string) {
        const relationship = await this.relationshipService.findOneByUsers(myUUID, friendUUID);
        if (!relationship) {
            throw new NotFoundException();
        }
        return relationship;
    }

    public async updateMyFriend(myUUID: string, friendUUID: string, updateRelDto: UpdateRelationshipDto) {
        const relationship = this.findMyFriend(myUUID, friendUUID);
        const query = Object(updateRelDto);
        return await this.relationshipService.update(relationship['uuid'], myUUID, query);
    }

    public async deleteMyFriend(myUUID: string, friendUUID: string) {
        const relationship = this.findMyFriend(myUUID, friendUUID);
        await this.relationshipService.remove(relationship['uuid'], myUUID);
    }
}
