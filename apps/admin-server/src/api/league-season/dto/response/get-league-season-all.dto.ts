import { LeagueSeasonOverviewEntity } from '../../entity/league-season-overview.entity';

export class GetLeagueSeasonAllResponseDto {
  public hasNext: boolean;
  public leagueSeasonOverviewList: LeagueSeasonOverviewEntity[];
}
