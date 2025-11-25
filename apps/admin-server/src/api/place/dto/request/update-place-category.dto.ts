import { PickType } from '@nestjs/swagger';
import { CreatePlaceCategoryDto } from './create-place-category.dto';

export class UpdatePlaceCategoryDto extends PickType(CreatePlaceCategoryDto, [
  'typeList',
  'mainCategoryList',
  'moodCategoryList',
]) {}
