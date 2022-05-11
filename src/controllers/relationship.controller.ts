import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RelationshipService } from '../services/relationship.service';
import { CreateRelationshipDto } from '../dto/create-relationship.dto';
import { UpdateRelationshipDto } from '../dto/update-relationship.dto';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { RolesGuard } from 'src/utile/guard/roles.guard';
import { UserInfo } from 'src/utile/decorators/user.decorator';

@Roles('ADMIN')
@UseGuards(AuthGuard, RolesGuard)
@Controller('relationship')
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}

  @Post()
  create(@Body() createRelationshipDto: CreateRelationshipDto) {
    const {user_a_uuid, user_b_uuid, relationship} = createRelationshipDto;
    return this.relationshipService.create(user_a_uuid, user_b_uuid, relationship);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relationshipService.findOneByUUID(id);
  }

  @Patch(':id')
  update(@UserInfo('uuid') uuid: string, @Param('id') id: string, @Body() updateRelationshipDto: UpdateRelationshipDto) {
    return this.relationshipService.update(id, updateRelationshipDto);
  }

  @Delete(':id')
  remove(@UserInfo('uuid') uuid: string, @Param('id') id: string) {
    return this.relationshipService.remove(id);
  }

  @Get()
  findAll() {
    return this.relationshipService.findAll();
  }
}
