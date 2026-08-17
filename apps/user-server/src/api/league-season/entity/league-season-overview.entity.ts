import { LeagueSeasonOverviewModel } from '@libs/core/league-season/model/league-season-overview.model';
import { PickType } from '@nestjs/swagger';
import { LeagueSeasonEntity } from './league-season.entity';

export class LeagueSeasonOverviewEntity extends PickType(LeagueSeasonEntity, [
  'idx',
  'name',
  'startAt',
  'endAt',
  'activatedAt',
  'createdAt',
]) {
  constructor(data: LeagueSeasonOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonOverviewModel,
  ): LeagueSeasonOverviewEntity {
    return new LeagueSeasonOverviewEntity({
      idx: model.idx,
      name: model.name,
      startAt: model.startAt,
      endAt: model.endAt,
      activatedAt: model.activatedAt,
      createdAt: model.createdAt,
    });
  }
}
