import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRelationshipDto } from './create-relationship.dto';

export class UpdateRelationshipDto extends PartialType(OmitType(CreateRelationshipDto, ['user_a_uuid', 'user_b_uuid'] as const)) {}
