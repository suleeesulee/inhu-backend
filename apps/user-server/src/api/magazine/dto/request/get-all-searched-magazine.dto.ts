import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class GetAllSearchedMagazineDto {
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
   * - 매거진 제목, 매거진 설명, 매거진 내용으로 검색 가능
   */
  @IsOptional()
  @MaxLength(20)
  searchKeyword?: string;
}
