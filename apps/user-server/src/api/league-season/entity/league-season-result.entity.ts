import { PlaceVisitStatisticEntity } from '@user/api/place-visit/entity/place-visit-statistic.entity';
import { LeagueSeasonResultUserRankingEntity } from './league-season-result-user-ranking.entity';
import { LeagueSeasonEntity } from './league-season.entity';
import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { UserRewardEntity } from '@user/api/user-reward/entity/user-reward.entity';
import { LeagueSeasonResultUserRankingModel } from '@libs/core/league-season/model/league-season-result-user-ranking.model';
import { PlaceVisitStatisticModel } from '@libs/core/place-visit/model/place-visit-statistic.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';

export class LeagueSeasonResultEntity {
  public id: string;
  public createdAt: Date;
  public leagueSeason: LeagueSeasonEntity;
  public participantCount: number;
  public userRanking: LeagueSeasonResultUserRankingEntity;
  public placeVisitStatistic: PlaceVisitStatisticEntity;
  public userReward: UserRewardEntity;

  constructor(data: LeagueSeasonResultEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultModel,
    userRanking: LeagueSeasonResultUserRankingModel,
    placeVisitStatistic: PlaceVisitStatisticModel,
    userReward: UserRewardModel,
  ): LeagueSeasonResultEntity {
    return new LeagueSeasonResultEntity({
      id: model.id,
      createdAt: model.createdAt,
      leagueSeason: LeagueSeasonEntity.fromModel(model.leagueSeason),
      participantCount: model.participantCount,
      userRanking: LeagueSeasonResultUserRankingEntity.fromModel(userRanking),
      placeVisitStatistic:
        PlaceVisitStatisticEntity.fromModel(placeVisitStatistic),
      userReward: UserRewardEntity.fromModel(userReward),
    });
  }
}
