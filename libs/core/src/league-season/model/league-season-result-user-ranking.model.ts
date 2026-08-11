import { SelectLeagueSeasonResultUserRanking } from './prisma-type/select-league-season-result-user-ranking';

export class LeagueSeasonResultUserRankingModel {
  public leagueSeasonIdx: number;
  public userIdx: number;
  public nickname: string;
  public seasonRank: number;
  public seasonScore: number;
  public seasonLatestVisitAt: Date;
  public cumulativeRank: number;
  public cumulativeScore: number;
  public cumulativeLatestVisitAt: Date;

  constructor(data: LeagueSeasonResultUserRankingModel) {
    Object.assign(this, data);
  }

  public static fromQuery(
    data: SelectLeagueSeasonResultUserRanking,
  ): LeagueSeasonResultUserRankingModel {
    return new LeagueSeasonResultUserRankingModel({
      leagueSeasonIdx: data.leagueSeasonIdx,
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
