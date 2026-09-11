export class CumulativeLeagueSeasonEntity {
  /**
   * 누적 league season 참여자 수
   *
   * @example 500
   */
  public cumulativeRankingParticipantCount: number;

  constructor(data: CumulativeLeagueSeasonEntity) {
    Object.assign(this, data);
  }
}
