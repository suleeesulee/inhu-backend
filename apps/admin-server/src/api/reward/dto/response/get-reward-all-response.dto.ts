import { RewardEntity } from '../../entity/reward.entity';

export class GetRewardAllResponseDto {
  public count: number;
  public rewardList: RewardEntity[];
}
