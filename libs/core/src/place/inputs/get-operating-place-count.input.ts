import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { PlaceType } from '../constants/place-type.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';

export class GetOperatingPlaceCountInput {
  types: PlaceType[];
  mainCategoryList?: MainCategory[];
  moodCategoryList?: MoodCategory[];
  freeTagList?: string[];
  lowPrice?: boolean;
}
