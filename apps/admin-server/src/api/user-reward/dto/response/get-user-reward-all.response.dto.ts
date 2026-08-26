import { UserRewardEntity } from '../../entity/user-reward.entity';

export class GetUserRewardAllResponseDto {
  public count: number;
  public userRewardList: UserRewardEntity[];
}
