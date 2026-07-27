import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsKoreanTime } from '@libs/common/decorator/is-korean-time.decorator';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMealItemDto } from './create-meal-item.dto';

export class CreateMealOfferingDto {
  /**
   * 운영 시작 시간
   *
   * @example "08:00:00"
   */
  @IsString()
  @IsKoreanTime()
  public startTime: string;

  /**
   * 운영 종료 시간
   *
   * @example "10:00:00"
   */
  @IsString()
  @IsKoreanTime()
  public endTime: string;

  /**
   * 칼로리
   *
   * @example 500
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public kcal?: number;

  /**
   * 등록된 학식 날짜
   *
   * @example "2026-04-20"
   */
  @IsString()
  @IsKoreanDate()
  public servedDate: string;

  /**
   * 학식 메뉴 리스트
   */
  @ValidateNested({ each: true })
  @Type(() => CreateMealItemDto)
  public mealItemList: CreateMealItemDto[];
}
