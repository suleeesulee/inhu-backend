import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetPlaceOverviewDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  public page: number;

  /**
   * 활성화 여부
   *
   * - true: 활성화된 장소만 조회
   * - false: 비활성화된 장소만 조회
   * - undefined: 모든 장소 조회
   */
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  public active?: boolean;

  /**
   * 검색 키워드
   *
   * - 장소 이름, 메뉴 이름, 메뉴 설명으로 검색 가능
   */
  @IsString()
  @IsOptional()
  public search?: string;

  /**
   * 1: 카페
   * 2: 음식점
   * 3: 술집
   */
  @IsOptional()
  @IsEnumValue(PlaceType)
  @Type(() => Number)
  type?: PlaceType;
}
