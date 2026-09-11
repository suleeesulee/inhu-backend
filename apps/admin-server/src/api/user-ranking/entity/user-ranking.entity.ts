import { UserRewardOverviewEntity } from '@admin/api/user-reward/entity/user-reward-overview.entity';
import { UserEntity } from '@admin/api/user/entity/user.entity';
import { RewardModel } from '@libs/core/reward/model/reward.model';
import { UserRankingModel } from '@libs/core/user-ranking/model/user-ranking.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';
import { UserModel } from '@libs/core/user/model/user.model';

export class UserRankingEntity {
  /**
   * 시즌 랭킹
   *
   * @example 1
   */
  public seasonRank: number;

  /**
   * 시즌 점수
   *
   * @example 1000
   */
  public seasonScore: number;

  /**
   * 시즌 내 가장 최근 방문 일시
   */
  public seasonLatestVisitAt: Date;

  /**
   * 누적 랭킹
   *
   * @example 1
   */
  public cumulativeRank: number;

  /**
   * 누적 점수
   *
   * @example 5000
   */
  public cumulativeScore: number;

  /**
   * 누적 기준 가장 최근 방문 일시
   */
  public cumulativeLatestVisitAt: Date;

  /**
   * 사용자 정보
   */
  public user: UserEntity;

  /**
   * 리워드 정보
   */
  public userReward: UserRewardOverviewEntity | null;

  constructor(data: UserRankingEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRankingModel,
    user: UserModel,
    userReward: UserRewardModel | null,
    reward: RewardModel | null,
  ): UserRankingEntity {
    return new UserRankingEntity({
      seasonRank: model.seasonRank!,
      seasonScore: model.seasonScore,
      seasonLatestVisitAt: model.seasonLatestVisitAt!,
      cumulativeRank: model.cumulativeRank!,
      cumulativeScore: model.cumulativeScore,
      cumulativeLatestVisitAt: model.cumulativeLatestVisitAt!,
      user: UserEntity.fromModel(user),
      userReward: userReward
        ? UserRewardOverviewEntity.fromModel(userReward, reward)
        : null,
    });
  }
}
