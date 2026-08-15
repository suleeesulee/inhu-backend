import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { UserRewardStatus } from '@libs/core/user-reward/constants/user-reward-status.enum';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class GetUserRewardAllDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number;

  /**
   * 사용자 리워드 상태
   *
   * @example 'issued'
   */
  @IsOptional()
  @IsEnumValue(UserRewardStatus)
  public status?: UserRewardStatus;

  /**
   * 정렬 방향
   *
   * @example 'desc'
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public leagueSeasonIdx?: number;
}
