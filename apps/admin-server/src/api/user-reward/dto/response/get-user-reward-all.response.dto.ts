import { UserRewardOverviewEntity } from '../../entity/user-reward-overview.entity';

export class GetUserRewardAllResponseDto {
  public count: number;
  public userRewardList: UserRewardOverviewEntity[];
}
