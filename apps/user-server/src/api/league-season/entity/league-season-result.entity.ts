import { PlaceVisitStatisticEntity } from '@user/api/place-visit/entity/place-visit-statistic.entity';
import { LeagueRewardOptionEntity } from './league-reward-option.entity';
import { LeagueSeasonResultUserRankingEntity } from './league-season-result-user-ranking.entity';
import { LeagueSeasonEntity } from './league-season.entity';
import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';

export class LeagueSeasonResultEntity {
  public id: string;
  public createdAt: Date;
  public leagueSeason: LeagueSeasonEntity;
  public participantCount: number;
  public userRanking: LeagueSeasonResultUserRankingEntity;
  public rewardOptionList: LeagueRewardOptionEntity[];
  public placeVisitStatistic: PlaceVisitStatisticEntity;

  constructor(data: LeagueSeasonResultEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultModel,
    userRanking: LeagueSeasonResultUserRankingEntity,
    placeVisitStatistic: PlaceVisitStatisticEntity,
    rewardOptionList: LeagueRewardOptionEntity[],
  ): LeagueSeasonResultEntity {
    return new LeagueSeasonResultEntity({
      id: model.id,
      createdAt: model.createdAt,
      leagueSeason: LeagueSeasonEntity.fromModel(model.leagueSeason),
      participantCount: model.participantCount,
      userRanking,
      rewardOptionList,
      placeVisitStatistic,
    });
  }
}
