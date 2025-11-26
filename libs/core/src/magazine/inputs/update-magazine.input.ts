import { PartialType } from '@nestjs/swagger';
import { CreateMagazineInput } from './create-magazine.input';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

export class UpdateMagazineInput extends PartialType(CreateMagazineInput) {
  /**
   * 활성화 여부
   *
   * - true: 활성화
   * - false: 비활성화
   */
  activate?: boolean;

  typeList?: PlaceType[];
  mainCategoryList?: MainCategory[];
  moodCategoryList?: MoodCategory[];
}
