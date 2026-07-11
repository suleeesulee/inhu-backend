import { SelectUserRewardLeagueSeason } from './prisma-type/select-user-reward-league-season';

export class UserRewardLeagueSeasonModel {
  public idx: number;
  public name: string;
  public startAt: Date;
  public endAt: Date;

  constructor(data: UserRewardLeagueSeasonModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    leagueSeason: SelectUserRewardLeagueSeason,
  ): UserRewardLeagueSeasonModel {
    return new UserRewardLeagueSeasonModel({
      idx: leagueSeason.idx,
      name: leagueSeason.name,
      startAt: leagueSeason.startAt,
      endAt: leagueSeason.endAt,
    });
  }
}
