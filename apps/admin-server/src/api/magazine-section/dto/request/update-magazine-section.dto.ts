import { PickType } from '@nestjs/swagger';
import { CreateMagazineSectionDto } from './create-magazine-section.dto';

export class UpdateMagazineSectionDto extends PickType(
  CreateMagazineSectionDto,
  ['title', 'parameter'],
) {}
