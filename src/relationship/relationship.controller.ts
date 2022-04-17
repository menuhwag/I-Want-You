import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { AuthGuard } from 'src/utile/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('relationship')
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}
  // 관계 등록 post
  // uuid로 관계 조회 get
  // 관계 수정 update
  // 관계 삭제 del > 친구삭제 (차단x)

  @Post()
  create(@Body() createRelationshipDto: CreateRelationshipDto) {
    return this.relationshipService.create(createRelationshipDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relationshipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelationshipDto: UpdateRelationshipDto) {
    return this.relationshipService.update(+id, updateRelationshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relationshipService.remove(+id);
  }

  @Get()
  findAll() {
    return this.relationshipService.findAll();
  }
}
