import { RewardEntity } from '../../entity/reward.entity';

export class GetRewardAllResponseDto {
  hasNext: boolean;
  rewardList: RewardEntity[];
}
