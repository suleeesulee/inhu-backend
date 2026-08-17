import { LeagueSeasonResultUserRankingModel } from '@libs/core/league-season/model/league-season-result-user-ranking.model';
import { PickType } from '@nestjs/swagger';
import { UserRankingEntity } from '@user/api/user-ranking/entity/user-ranking.entity';

export class LeagueSeasonResultUserRankingEntity extends PickType(
  UserRankingEntity,
  [
    'seasonRank',
    'seasonScore',
    'seasonLatestVisitAt',
    'cumulativeRank',
    'cumulativeScore',
    'cumulativeLatestVisitAt',
  ],
) {
  constructor(data: LeagueSeasonResultUserRankingEntity) {
    super();
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
