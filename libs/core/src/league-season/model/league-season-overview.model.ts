import { PickType } from '@nestjs/swagger';
import { LeagueSeasonModel } from './league-season.model';
import { SelectLeagueSeasonOverview } from './prisma-type/select-league-season-overview';

export class LeagueSeasonOverviewModel extends PickType(LeagueSeasonModel, [
  'idx',
  'name',
  'startAt',
  'endAt',
  'activatedAt',
  'createdAt',
]) {
  constructor(data: LeagueSeasonOverviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    leagueSeason: SelectLeagueSeasonOverview,
  ): LeagueSeasonOverviewModel {
    return new LeagueSeasonOverviewModel({
      idx: leagueSeason.idx,
      name: leagueSeason.name,
      startAt: leagueSeason.startAt,
      endAt: leagueSeason.endAt,
      activatedAt: leagueSeason.activatedAt,
      createdAt: leagueSeason.createdAt,
    });
  }
}
