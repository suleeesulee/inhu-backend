import { OmitType } from '@nestjs/swagger';
import { MainCategory } from '../category/constants/main-category.constant';
import { MoodCategory } from '../category/constants/mood-category.constant';
import { PlaceType } from '../place/constants/place-type.constant';
import { GetAllMagazineDto } from '@user/api/magazine/dto/request/get-all-magazine.dto';

export class MagazineSectionParameter extends OmitType(GetAllMagazineDto, [
  'page',
]) {
  /**
   * 정렬 옵션
   *
   * @example "time"
   */
  orderBy: 'like' | 'view' | 'time';

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 술집
   */
  type?: PlaceType;

  /**
   * 1 ~ 19 메인 카테고리 리스트
   */
  mainCategoryList?: MainCategory[];

  /**
   * 1 ~ 13 상황 카테고리 리스트
   */
  moodCategoryList?: MoodCategory[];
}
