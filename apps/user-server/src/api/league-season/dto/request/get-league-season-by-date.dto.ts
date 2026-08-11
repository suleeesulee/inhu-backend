import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetLeagueSeasonByDateDto {
  /**
   * league season 시작일 날짜 (YYYY-MM-DD)
   *
   * @example "2026-08-03"
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  startAt: string;

  /**
   * league season 종료일 날짜 (YYYY-MM-DD)
   *
   * @example "2026-08-17"
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  endAt: string;
}
