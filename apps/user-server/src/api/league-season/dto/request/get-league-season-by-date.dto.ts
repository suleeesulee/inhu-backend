import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetLeagueSeasonByDateDto {
  /**
   * league season 시작일
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  startAt: string;

  /**
   * league season 종료일
   */
  @IsNotEmpty()
  @IsString()
  @IsKoreanDate()
  endAt: string;
}
