import { PartialType } from '@nestjs/swagger';
import { CreateMagazineSectionInput } from './create-magazine-section.input';

export class UpdateMagazineSectionInput extends PartialType(
  CreateMagazineSectionInput,
) {}
