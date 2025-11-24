import { MainCategory } from '@libs/core/category/contants/main-category.contant';
import { CreatePlaceInput } from './create-place.input';
import { PartialType } from '@nestjs/swagger';
import { MoodCategory } from '@libs/core/category/contants/mood-category.constant';

/**
 * 장소 수정 입력 input
 *
 * @publicApi
 */
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {
  mainCategoryList?: MainCategory[];
  moodCategoryList?: MoodCategory[];
}
