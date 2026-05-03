import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetFoodStationDto {
  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-26
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  servedDate: string;
}
