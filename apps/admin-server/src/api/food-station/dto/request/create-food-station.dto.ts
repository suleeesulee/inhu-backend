import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsKoreanTime } from '@libs/common/decorator/is-korean-time.decorator';
import { MealType } from '@libs/core/food-station/constants/meal-type.constant';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFoodStationDto {
  /**
   * 식사 분류 타입
   *
   * 1: 조식, 2: 중식, 3: 석식
   */
  @IsNotEmpty()
  @IsEnumValue(MealType)
  mealType: MealType;

  /**
   * 코너 이름
   *
   * @example '한식 코너'
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 기본 운영 시작 시간
   *
   * @example '08:00:00'
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanTime()
  startTime: string;

  /**
   * 기본 운영 종료 시간
   *
   * @example '10:00:00'
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanTime()
  endTime: string;

  /**
   * 코너 운영 시작 날짜
   *
   * @example '2026-04-20'
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  startDate: string;

  /**
   * 코너 운영 종료 날짜
   *
   * @example '2026-04-26'
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  endDate: string;
}
