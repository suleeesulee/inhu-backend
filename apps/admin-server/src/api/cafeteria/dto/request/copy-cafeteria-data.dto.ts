import { IsInt, IsPositive, IsString, Matches } from 'class-validator';

export class CopyCafeteriaDataDto {
  /**
   * 복사할 날짜 범위 시작 (YYYY-MM-DD)
   * @example "2024-03-01"
   */
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  /**
   * 복사할 날짜 범위 종료 (YYYY-MM-DD)
   * @example "2024-03-01"
   */
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate: string;

  /**
   * 복사 대상 식당 idx
   * @example 1
   */
  @IsInt()
  @IsPositive()
  fromIdx: number;
}
