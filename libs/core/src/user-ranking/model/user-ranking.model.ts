import { SelectUserRanking } from './prisma-type/select-user-ranking';

export class UserRankingModel {
  public userIdx: number;
  public nickname: string;
  public seasonRank: number | null;
  public seasonScore: number;
  public seasonLatestVisitAt: Date | null;
  public cumulativeRank: number | null;
  public cumulativeScore: number;
  public cumulativeLatestVisitAt: Date | null;

  constructor(data: UserRankingModel) {
    Object.assign(this, data);
  }

  public static fromQuery(data: SelectUserRanking): UserRankingModel {
    return new UserRankingModel({
      userIdx: data.userIdx,
      nickname: data.nickname,
      seasonRank: data.seasonRank,
      seasonScore: data.seasonScore,
      seasonLatestVisitAt: data.seasonLatestVisitAt,
      cumulativeRank: data.cumulativeRank,
      cumulativeScore: data.cumulativeScore,
      cumulativeLatestVisitAt: data.cumulativeLatestVisitAt,
    });
  }
}
