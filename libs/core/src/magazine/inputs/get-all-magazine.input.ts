import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class GetAllMagazineInput {
  /**
   * 한 번에 가져올 개수
   */
  take: number;

  /**
   * 스킵할 데이터의 개수
   */
  skip: number;

  /**
   * 활성화 필터링
   *
   * - true: 활성화된 장소만
   * - false: 비활성화된 장소만
   * - undefined: 활성화된 장소와 비활성화된 장소 모두 가져오기
   */
  activated?: boolean;

  /**
   * 정렬 옵션
   *
   * like = 좋아요 많은 순
   * view = 조회수 높은 순
   * time = 시간순
   */
  orderBy?: 'like' | 'view' | 'time';

  /**
   * 고정된 매거진만 조회 여부
   *
   * - true: 고정된 매거진만
   * - false: 고정되지 않은 매거진만
   * - undefined: 전체 매거진
   */
  pinned?: boolean;

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 편의점
   */
  typeList?: PlaceType[];

  /**
   * 1: 밥집
   * 2: 일식
   * 3: 중식
   * 4: 양식
   * 5: 분식
   * 6: 아시안
   * 7: 패스트푸드
   * 8: 고기
   * 9: 베이커리
   * 10: 샌드위치
   * 11: 디저트
   * 12: 아이스크림
   * 13: 붕어빵
   * 14: 테이크아웃
   * 15: 이자카야
   * 16: 요리주점
   * 17: 맥주
   * 18: 바
   * 19: 밥술집
   */
  mainCategoryList?: MainCategory[];

  /**
   * 분위기 카테고리 리스트
   *
   * 1: 혼밥
   * 2: 데이트
   * 3: 단체
   * 4: 분위기맛집
   * 5: 카공맛집
   * 6: 디저트맛집
   * 7: 혼술
   * 8: 갓성비안주
   */
  moodCategoryList?: MoodCategory[];
}
