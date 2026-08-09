import { SelectUserRanking } from './prisma-type/select-user-ranking';

export class UserRankingModel {
  public userIdx: number;
  public nickname: string;
  public seasonRank: number | null;
  public seasonScore: number;
  public cumulativeRank: number | null;
  public cumulativeScore: number;

  constructor(data: UserRankingModel) {
    Object.assign(this, data);
  }

  public static fromQuery(data: SelectUserRanking): UserRankingModel {
    return new UserRankingModel({
      userIdx: data.userIdx,
      nickname: data.nickname,
      seasonRank: data.seasonRank,
      seasonScore: data.seasonScore,
      cumulativeRank: data.cumulativeRank,
      cumulativeScore: data.cumulativeScore,
    });
  }
}
