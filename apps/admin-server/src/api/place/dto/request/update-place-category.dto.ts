import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from '../../entity/place.entity';

export class UpdatePlaceCategoryDto extends PickType(PlaceEntity, [
  'typeList',
  'mainCategoryList',
  'moodCategoryList',
]) {}
