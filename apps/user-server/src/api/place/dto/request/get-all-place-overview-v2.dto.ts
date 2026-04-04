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
   * 1 ~ 19 메인 카테고리 리스트
   */
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MainCategory, { each: true })
  @Type(() => Number)
  mainCategoryList?: MainCategory[];

  /**
   * 1 ~ 13 상황 카테고리 리스트
   */
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MoodCategory, { each: true })
  @Type(() => Number)
  moodCategoryList?: MoodCategory[];

  /**
   * 만원 이하 여부
   *
   * true: 만원 이하 메뉴가 있는 장소만
   * undefined: 만원 이하 여부 상관없이 모두 가져오기
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  lowPrice?: boolean;

  /**
   * 우선순위 따라 정렬 여부
   *
   * true: 우선순위 정렬 사용
   * false: 우선순위 정렬 사용 안함
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  priority?: boolean;
}
