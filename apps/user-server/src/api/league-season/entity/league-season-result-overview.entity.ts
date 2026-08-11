import { PickType } from '@nestjs/swagger';
import { LeagueSeasonResultEntity } from './league-season-result.entity';
import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';
import { LeagueSeasonResultUserRankingModel } from '@libs/core/league-season/model/league-season-result-user-ranking.model';
import { UserRewardEntity } from '@user/api/user-reward/entity/user-reward.entity';
import { LeagueSeasonResultUserRankingEntity } from './league-season-result-user-ranking.entity';
import { LeagueSeasonEntity } from './league-season.entity';

export class LeagueSeasonResultOverviewEntity extends PickType(
  LeagueSeasonResultEntity,
  ['id', 'createdAt', 'leagueSeason', 'userRanking', 'userReward'],
) {
  constructor(data: LeagueSeasonResultOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultModel,
    userRanking: LeagueSeasonResultUserRankingModel,
    userReward: UserRewardModel,
  ): LeagueSeasonResultOverviewEntity {
    return new LeagueSeasonResultOverviewEntity({
      id: model.id,
      createdAt: model.createdAt,
      leagueSeason: LeagueSeasonEntity.fromModel(model.leagueSeason),
      userRanking: LeagueSeasonResultUserRankingEntity.fromModel(userRanking),
      userReward: UserRewardEntity.fromModel(userReward),
    });
  }
}
