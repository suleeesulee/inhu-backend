import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDailyMemoAllDto {
  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-20
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  startDate: string;

  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-26
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  endDate: string;
}
