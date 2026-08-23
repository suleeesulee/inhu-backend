import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsOptional, IsString } from 'class-validator';

export class GetLeagueSeasonByDateDto {
  /**
   * league season 시작일 날짜 (YYYY-MM-DD)
   *
   * @example "2026-08-03"
   */
  @IsOptional()
  @IsString()
  @IsKoreanDate()
  startAt?: string;

  /**
   * league season 종료일 날짜 (YYYY-MM-DD)
   *
   * @example "2026-08-17"
   */
  @IsOptional()
  @IsString()
  @IsKoreanDate()
  endAt?: string;
}
