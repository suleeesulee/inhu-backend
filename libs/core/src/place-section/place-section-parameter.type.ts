import { MainCategory } from '../category/constants/main-category.constant';

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
   * 메인 카테고리 리스트
   */
  mainCategoryList?: MainCategory[];

  /**
   * 자유 태그 리스트
   *
   * @example ["가성비 좋은", "조용한"]
   */
  freeTagList?: string[];
}
