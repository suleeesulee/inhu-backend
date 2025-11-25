import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from '../../entity/place.entity';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';

export class CreatePlaceCategoryDto extends PickType(PlaceEntity, [
  'mainCategoryList',
  'moodCategoryList',
]) {
  @UniqueArray()
  @IsEnumValue(PlaceType, { each: true })
  public typeList: PlaceType[];
}
