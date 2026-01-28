import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetRouletteItemDto {
  /**
   * 1: 카페
   * 2: 음식점
   * 3: 술집
   */
  @IsEnumValue(PlaceType)
  @Type(() => Number)
  type: PlaceType;

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
   * 분위기 카테고리 리스트
   */
  @IsOptional()
  @ToArray()
  @UniqueArray()
  @IsEnumValue(MoodCategory, { each: true })
  @Type(() => Number)
  moodCategoryList?: MoodCategory[];

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
}
