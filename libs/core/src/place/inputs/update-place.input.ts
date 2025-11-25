import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { CreatePlaceInput } from './create-place.input';
import { PartialType } from '@nestjs/swagger';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

/**
 * 장소 수정 입력 input
 *
 * @publicApi
 */
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {
  mainCategoryList?: MainCategory[];
  moodCategoryList?: MoodCategory[];
}
