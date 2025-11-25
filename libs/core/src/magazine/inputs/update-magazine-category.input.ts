import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class UpdateMagazineCategoryInput {
  typeList: PlaceType[];
  mainCategoryList: MainCategory[];
  moodCategoryList: MoodCategory[];
}
