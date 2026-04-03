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
  MaxLength,
  Min,
} from 'class-validator';

export class GetAllSearchedPlaceOverviewDto {
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
   * 검색 필터링
   *
   * - 장소 이름, 메뉴 이름, 검색 태그로 검색 가능
   */
  @IsOptional()
  @MaxLength(20)
  searchKeyword?: string;

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
