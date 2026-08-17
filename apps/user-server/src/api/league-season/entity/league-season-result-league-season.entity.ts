import { PickType } from '@nestjs/swagger';
import { LeagueSeasonEntity } from './league-season.entity';
import { LeagueSeasonModel } from '@libs/core/league-season/model/league-season.model';
import { LeagueRewardOptionEntity } from './league-reward-option.entity';

export class LeagueSeasonResultLeagueSeasonEntity extends PickType(
  LeagueSeasonEntity,
  [
    'idx',
    'name',
    'startAt',
    'endAt',
    'activatedAt',
    'createdAt',
    'rewardOptionList',
  ],
) {
  constructor(data: LeagueSeasonResultLeagueSeasonEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonModel,
  ): LeagueSeasonResultLeagueSeasonEntity {
    return new LeagueSeasonResultLeagueSeasonEntity({
      idx: model.idx,
      name: model.name,
      startAt: model.startAt,
      endAt: model.endAt,
      activatedAt: model.activatedAt,
      createdAt: model.createdAt,
      rewardOptionList: model.rewardOptionList.map(
        LeagueRewardOptionEntity.fromModel,
      ),
    });
  }
}
