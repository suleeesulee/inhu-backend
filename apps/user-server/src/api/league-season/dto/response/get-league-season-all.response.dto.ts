import { LeagueSeasonOverviewEntity } from '../../entity/league-season-overview.entity';

export class GetLeagueSeasonAllResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  public hasNext: boolean;

  /**
   * 리그 시즌 개요 리스트
   */
  public leagueSeasonOverviewList: LeagueSeasonOverviewEntity[];
}
