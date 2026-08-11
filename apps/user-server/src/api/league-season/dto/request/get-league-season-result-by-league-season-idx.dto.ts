import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetLeagueSeasonResultByLeagueSeasonIdxDto {
  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-20
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  public startAt: string;

  /**
   * 날짜 (YYYY-MM-DD)
   *
   * @example 2026-04-20
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  public endAt: string;
}
