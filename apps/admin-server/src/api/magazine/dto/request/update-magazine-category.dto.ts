import { PickType } from '@nestjs/swagger';
import { CreateMagazineCategoryDto } from './create-magazine-category.dto';

export class UpdateMagazineCategoryDto extends PickType(
  CreateMagazineCategoryDto,
  ['typeList', 'mainCategoryList', 'moodCategoryList'],
) {}
