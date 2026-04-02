import { PartialType } from '@nestjs/swagger';
import { CreateMagazineSectionInput } from './create-place-section.input';

export class UpdateMagazineSectionInput extends PartialType(
  CreateMagazineSectionInput,
) {}
