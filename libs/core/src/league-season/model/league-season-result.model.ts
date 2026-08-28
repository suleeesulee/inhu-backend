import { SelectLeagueSeasonResult } from './prisma-type/select-league-season-result';
import { LeagueSeasonModel } from './league-season.model';

export class LeagueSeasonResultModel {
  public id: string;
  public userIdx: number;
  public finalScore: number;
  public createdAt: Date;
  public leagueSeason: LeagueSeasonModel;
  public participantCount: number;

  constructor(data: LeagueSeasonResultModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    data: SelectLeagueSeasonResult,
  ): LeagueSeasonResultModel {
    return new LeagueSeasonResultModel({
      id: data.id,
      userIdx: data.userIdx,
      finalScore: data.finalScore,
      createdAt: data.createdAt,
      leagueSeason: LeagueSeasonModel.fromPrisma(data.leagueSeason),
      participantCount: data.leagueSeason._count.leagueSeasonResultList,
    });
  }
}
