import { RewardModel } from '@libs/core/reward/model/reward.model';
import { SelectLeagueRewardOption } from './prisma-type/select-league-reward-option';

export class LeagueRewardOptionModel {
  /**
   * reward option 식별자
   */
  public id: string;

  /**
   * 보상 대상 순위
   */
  public targetRank: number;

  /**
   * 생성 일자
   */
  public createdAt: Date;

  /**
   * 보상 정보
   */
  public reward: RewardModel;

  constructor(data: LeagueRewardOptionModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    leagueRewardOption: SelectLeagueRewardOption,
  ): LeagueRewardOptionModel {
    return new LeagueRewardOptionModel({
      id: leagueRewardOption.id,
      targetRank: leagueRewardOption.targetRank,
      createdAt: leagueRewardOption.createdAt,
      reward: RewardModel.fromPrisma(leagueRewardOption.reward),
    });
  }
}
