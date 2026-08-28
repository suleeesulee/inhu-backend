import { LeagueSeasonOverviewEntity } from '../../entity/league-season-overview.entity';

export class GetLeagueSeasonAllResponseDto {
  public count: number;
  public leagueSeasonOverviewList: LeagueSeasonOverviewEntity[];
}
