import { UserRewardOverviewEntity } from '@admin/api/user-reward/entity/user-reward-overview.entity';
import { UserEntity } from '@admin/api/user/entity/user.entity';
import { RewardModel } from '@libs/core/reward/model/reward.model';
import { UserRankingModel } from '@libs/core/user-ranking/model/user-ranking.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';
import { UserModel } from '@libs/core/user/model/user.model';
import { PickType } from '@nestjs/swagger';
import { UserRankingEntity } from './user-ranking.entity';

export class UserRankingOverviewEntity extends PickType(UserRankingEntity, [
  'seasonRank',
  'seasonScore',
  'seasonLatestVisitAt',
  'user',
  'userReward',
]) {
  constructor(data: UserRankingOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRankingModel,
    user: UserModel,
    userReward: UserRewardModel | null,
    reward: RewardModel | null,
  ): UserRankingOverviewEntity {
    return new UserRankingOverviewEntity({
      seasonRank: model.seasonRank!,
      seasonScore: model.seasonScore,
      seasonLatestVisitAt: model.seasonLatestVisitAt!,
      user: UserEntity.fromModel(user),
      userReward: userReward
        ? UserRewardOverviewEntity.fromModel(userReward, reward)
        : null,
    });
  }
}
