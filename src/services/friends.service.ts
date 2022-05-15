import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRelationshipDto } from 'src/dto/update-relationship.dto';
import { RelationshipService } from '../services/relationship.service';

@Injectable()
export class FriendsService {
    constructor(private relationshipService: RelationshipService) {}

    public async add(myUUID: string, friendUUID: string) {
        return await this.relationshipService.create(myUUID, friendUUID);
    }

    public async findByUser(UUID: string) {
        return await this.relationshipService.findAllByUser(UUID);
    }

    public async findMyFriend(myUUID: string, friendUUID: string) {
        const relationship = await this.relationshipService.findOneByUser(
            myUUID,
            friendUUID,
        );
        if (!relationship) {
            throw new NotFoundException();
        }
        return relationship;
    }

    public async updateMyFriend(
        myUUID: string,
        friendUUID: string,
        updateRelDto: UpdateRelationshipDto,
    ) {
        const relationship = this.findMyFriend(myUUID, friendUUID);
        return await this.relationshipService.update(
            relationship['uuid'],
            updateRelDto,
        );
    }

    public async deleteMyFriend(myUUID: string, friendUUID: string) {
        const relationship = this.findMyFriend(myUUID, friendUUID);
        await this.relationshipService.remove(relationship['uuid']);
    }
}
