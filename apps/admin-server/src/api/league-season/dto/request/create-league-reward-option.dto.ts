import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateLeagueRewardOptionDto {
  /**
   * 보상 식별자
   *
   * @example 1
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rewardIdx: number;

  /**
   * 보상 대상 순위
   *
   * @example 1
   */
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetRank: number;
}
