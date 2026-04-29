import { PickType } from '@nestjs/swagger';
import { CreatePlaceSectionDto } from './create-place-section.dto';

export class UpdatePlaceSectionDto extends PickType(CreatePlaceSectionDto, [
  'title',
  'parameter',
]) {}
