import { SelectUserRewardLeagueSeasonResult } from './prisma-type/select-user-reward-league-season-result';
import { UserRewardLeagueSeasonModel } from './user-reward-league-season.model';

export class UserRewardLeagueSeasonResultModel {
  public id: string;
  public leagueSeasonIdx: number;
  public userIdx: number;
  public finalScore: number;
  public leagueSeason: UserRewardLeagueSeasonModel;

  constructor(data: UserRewardLeagueSeasonResultModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    leagueSeasonResult: SelectUserRewardLeagueSeasonResult,
  ): UserRewardLeagueSeasonResultModel {
    return new UserRewardLeagueSeasonResultModel({
      id: leagueSeasonResult.id,
      leagueSeasonIdx: leagueSeasonResult.leagueSeasonIdx,
      userIdx: leagueSeasonResult.userIdx,
      finalScore: leagueSeasonResult.finalScore,
      leagueSeason: UserRewardLeagueSeasonModel.fromPrisma(
        leagueSeasonResult.leagueSeason,
      ),
    });
  }
}
