import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLeagueRewardOptionDto {
  /**
   * 보상 식별자
   *
   * @example 1
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  rewardIdx: number;

  /**
   * 보상 대상 순위
   *
   * @example 1
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  targetRank: number;
}
