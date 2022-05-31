import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { AuthGuard } from 'src/utile/guard/auth.guard';
import { Roles } from 'src/utile/decorators/roles.decorator';
import { RolesGuard } from 'src/utile/guard/roles.guard';
import { UserInfo } from 'src/utile/decorators/user.decorator';
import { RelationshipEntity } from './entities/relationship.entity';

@Roles('ADMIN')
@UseGuards(AuthGuard, RolesGuard)
@Controller('relationship')
export class RelationshipController {
    constructor(private readonly relationshipService: RelationshipService) {}

    @Post()
    create(@Body() createRelationshipDto: CreateRelationshipDto): Promise<void> {
        const { user_a_uuid, user_b_uuid } = createRelationshipDto;
        return this.relationshipService.create(user_a_uuid, user_b_uuid);
    }

    @Get()
    findAll(@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<RelationshipEntity[] | null> {
        return this.relationshipService.findAll(offset, limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<RelationshipEntity | null> {
        return this.relationshipService.findOneByUUID(id);
    }

    @Patch(':id')
    update(@UserInfo('id') uuid: string, @Param('id') id: string, @Body() updateRelationshipDto: UpdateRelationshipDto): Promise<void> {
        const query = Object(updateRelationshipDto);
        return this.relationshipService.update(id, uuid, query);
    }

    @Delete(':id')
    remove(@UserInfo('id') uuid: string, @Param('id') id: string): Promise<void> {
        return this.relationshipService.remove(id, uuid);
    }
}
