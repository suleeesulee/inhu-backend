import { RewardEntity } from '@admin/api/reward/entity/reward.entity';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';
import { UserModel } from '@libs/core/user/model/user.model';
import { RewardModel } from '@libs/core/reward/model/reward.model';
import { PickType } from '@nestjs/swagger';
import { UserRewardEntity } from './user-reward.entity';
import { UserEntity } from '@admin/api/user/entity/user.entity';

export class UserRewardOverviewEntity extends PickType(UserRewardEntity, [
  'id',
  'createdAt',
  'selectedAt',
  'issuedAt',
  'reward',
]) {
  constructor(data: UserRewardOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRewardModel,
    reward: RewardModel | null,
  ): UserRewardOverviewEntity {
    return new UserRewardOverviewEntity({
      id: model.id,
      createdAt: model.createdAt,
      selectedAt: model.selectedAt,
      issuedAt: model.issuedAt,
      reward: reward ? RewardEntity.fromModel(reward) : null,
    });
  }
}
