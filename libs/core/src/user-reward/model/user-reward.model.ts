import { SelectUserReward } from './prisma-type/select-user-reward';
import { UserRewardLeagueSeasonResultModel } from './user-reward-league-season-result.model';

export class UserRewardModel {
  /**
   * user reward 식별자
   */
  public id: string;

  /**
   * reward 식별자
   */
  public rewardIdx: number | null;

  /**
   * 생성 일자
   */
  public createdAt: Date;

  /**
   * 선택 일자
   */
  public selectedAt: Date | null;

  /**
   * 발급 일자
   */
  public issuedAt: Date | null;

  /**
   * 리그 시즌 결과
   */
  public leagueSeasonResult: UserRewardLeagueSeasonResultModel;

  constructor(data: UserRewardModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(userReward: SelectUserReward): UserRewardModel {
    return new UserRewardModel({
      id: userReward.id,
      rewardIdx: userReward.rewardIdx,
      createdAt: userReward.createdAt,
      selectedAt: userReward.selectedAt,
      issuedAt: userReward.issuedAt,
      leagueSeasonResult: UserRewardLeagueSeasonResultModel.fromPrisma(
        userReward.leagueSeasonResult,
      ),
    });
  }
}
