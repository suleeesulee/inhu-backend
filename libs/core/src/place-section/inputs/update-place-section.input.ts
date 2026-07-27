import { PartialType } from '@nestjs/swagger';
import { CreatePlaceSectionInput } from './create-place-section.input';

export class UpdatePlaceSectionInput extends PartialType(
  CreatePlaceSectionInput,
) {}
