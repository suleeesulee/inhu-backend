import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlaceSectionParameterDto {
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
   * 정렬 방향
   *
   * @example "desc"
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'desc' | 'asc' = 'desc';

  /**
   * 정렬 옵션
   *
   * @example "time"
   */
  @IsOptional()
  @IsIn(['time', 'review'])
  orderby: 'time' | 'review' = 'time';

  /**
   * 메인 카테고리 리스트
   */
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MainCategory, { each: true })
  @Type(() => Number)
  mainCategoryList?: MainCategory[];

  /**
   * 자유 태그 리스트
   */
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsString({ each: true })
  freeTagList?: string[];
}
