import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class GetAllPlaceOverviewV2Dto {
  /**
   * page number
   *
   * @example 1
   */
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  /**
   * 정렬 옵션
   *
   * @example "time"
   */
  @IsOptional()
  @IsIn(['time', 'review'])
  orderby: 'time' | 'review' = 'time';

  /**
   * 정렬 방향
   *
   * @example "desc"
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'desc' | 'asc' = 'desc';

  /**
   * 운영 중인 장소만 가져오기
   *
   * true: 운영 중인 장소만
   * false: 운영 중이지 않은 장소만
   * undefined: 운영 중인 장소와 운영 중이지 않은 장소 모두 가져오기
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  operating?: boolean;

  /**
   * 운영 중인 장소와 운영 중이지 않은 장소를 구분하여 정렬할지 여부
   *
   * true: 운영 중인 장소를 우선으로 정렬
   * undefined: 운영 중이지 않은 장소와 구분 없이 정렬
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  operatingOrderby?: boolean;

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 편의점
   */
  @IsOptional()
  @IsEnumValue(PlaceType)
  @Type(() => Number)
  type?: PlaceType;

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
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MainCategory, { each: true })
  @Type(() => Number)
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
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MoodCategory, { each: true })
  @Type(() => Number)
  moodCategoryList?: MoodCategory[];
}
