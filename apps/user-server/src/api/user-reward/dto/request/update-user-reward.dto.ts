import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserRewardDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  public rewardIdx: number;
}
