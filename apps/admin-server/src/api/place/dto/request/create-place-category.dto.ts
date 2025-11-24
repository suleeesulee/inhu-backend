import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from '../../entity/place.entity';

export class CreatePlaceCategoryDto extends PickType(PlaceEntity, [
  'mainCategoryList',
  'moodCategoryList',
]) {}
