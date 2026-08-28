import { RewardEntity } from '@admin/api/reward/entity/reward.entity';
import { LeagueRewardOptionModel } from '@libs/core/league-season/model/league-reward-option.model';

export class LeagueRewardOptionEntity {
  /**
   * reward option 식별자
   *
   * @example 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'
   */
  public id: string;

  /**
   * 보상 대상 순위
   *
   * @example 1
   */
  public targetRank: number;

  /**
   * 생성 일자
   */
  public createdAt: Date;

  /**
   * 보상 정보
   */
  public reward: RewardEntity;

  constructor(data: LeagueRewardOptionEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueRewardOptionModel,
  ): LeagueRewardOptionEntity {
    return new LeagueRewardOptionEntity({
      id: model.id,
      targetRank: model.targetRank,
      createdAt: model.createdAt,
      reward: RewardEntity.fromModel(model.reward),
    });
  }
}
