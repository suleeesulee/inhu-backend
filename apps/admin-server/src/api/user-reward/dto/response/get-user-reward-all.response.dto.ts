import { UserRewardOverviewEntity } from '../../entity/user-reward-overview.entity';

export class GetUserRewardAllResponseDto {
  public hasNext: boolean;
  public userRewardList: UserRewardOverviewEntity[];
}
