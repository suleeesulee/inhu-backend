import { UserRankingModel } from '@libs/core/user-ranking/model/user-ranking.model';

export class UserRankingEntity {
  public userIdx: number;
  public nickname: string;
  public seasonRank: number | null;
  public seasonScore: number;
  public cumulativeRank: number | null;
  public cumulativeScore: number;

  constructor(data: UserRankingEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserRankingModel): UserRankingEntity {
    return new UserRankingEntity({
      userIdx: model.userIdx,
      nickname: model.nickname,
      seasonRank: model.seasonRank,
      seasonScore: model.seasonScore,
      cumulativeRank: model.cumulativeRank,
      cumulativeScore: model.cumulativeScore,
    });
  }
}
