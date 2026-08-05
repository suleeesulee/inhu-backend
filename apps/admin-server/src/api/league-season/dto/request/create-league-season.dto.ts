import { IsKoreanDate } from '@libs/common/decorator/is-korean-date.decorator';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateLeagueRewardOptionDto } from './create-league-reward-option.dto';
import { Type } from 'class-transformer';

export class CreateLeagueSeasonDto {
  /**
   * league season 이름
   *
   * @example '2026년 5월 세 번째 시즌'
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * ! time까지 기입할지, day만 기입할지 정확한 기획 필요
   * 시작 날짜 (한국 날짜)
   *
   * @example '2026-08-03'
   */
  @IsString()
  @IsKoreanDate()
  startAt: Date;

  /**
   * ! start와 동일
   * 종료 날짜 (한국 날짜)
   *
   * @example '2026-08-17'
   */
  @IsString()
  @IsKoreanDate()
  endAt: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateLeagueRewardOptionDto)
  rewardOptionList: CreateLeagueRewardOptionDto[];
}
