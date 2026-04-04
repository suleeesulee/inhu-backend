import { MainCategory } from '../category/constants/main-category.constant';
import { MoodCategory } from '../category/constants/mood-category.constant';
import { PlaceType } from '../place/constants/place-type.constant';

export class PlaceSectionParameter {
  /**
   * page number
   *
   * @example 1
   */
  page: number;

  /**
   * 정렬 방향
   *
   * @example "desc"
   */
  order?: 'asc' | 'desc';

  /**
   * 정렬 옵션
   *
   * @example "time"
   */
  orderby?: 'time' | 'review';

  /**
   * 운영 중인 장소만 가져오기
   */
  operating?: boolean;

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 편의점
   */
  type?: PlaceType;

  /**
   * 메인 카테고리 리스트
   */
  mainCategoryList?: MainCategory[];

  /**
   * 상황 카테고리 리스트
   */
  moodCategoryList?: MoodCategory[];

  /**
   * 자유 태그 리스트
   *
   * @example ["가성비 좋은", "조용한"]
   */
  freeTagList?: string[];

  /**
   * 만원 이하 여부
   */
  lowPrice?: boolean;

  /**
   * 우선순위 따라 정렬 여부
   */
  priority?: boolean;
}
