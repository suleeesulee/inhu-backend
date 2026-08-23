import { LeagueSeasonResultOverviewEntity } from '../../entity/league-season-result-overview.entity';

export class GetLeagueSeasonResultAllResponseDto {
  /**
   * 다음 페이지 존재 여부
   *
   * @example true
   */
  public hasNext: boolean;

  /**
   * 리그 시즌 결과 개요 리스트
   */
  public leagueSeasonResultOverviewList: LeagueSeasonResultOverviewEntity[];
}
