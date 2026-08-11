import { LeagueSeasonResultUserRankingModel } from '@libs/core/league-season/model/league-season-result-user-ranking.model';

export class LeagueSeasonResultUserRankingEntity {
  public seasonRank: number;
  public seasonScore: number;
  public seasonLatestVisitAt: Date;
  public cumulativeRank: number;
  public cumulativeScore: number;
  public cumulativeLatestVisitAt: Date;

  constructor(data: LeagueSeasonResultUserRankingEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultUserRankingModel,
  ): LeagueSeasonResultUserRankingEntity {
    return new LeagueSeasonResultUserRankingEntity({
      seasonRank: model.seasonRank,
      seasonScore: model.seasonScore,
      seasonLatestVisitAt: model.seasonLatestVisitAt,
      cumulativeRank: model.cumulativeRank,
      cumulativeScore: model.cumulativeScore,
      cumulativeLatestVisitAt: model.cumulativeLatestVisitAt,
    });
  }
}
