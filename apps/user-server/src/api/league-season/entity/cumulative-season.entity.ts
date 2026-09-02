export class CumulativeSeasonEntity {
  /**
   * 누적 league season 참여자 수
   *
   * @example 500
   */
  public cumulativeRankingParticipantCount: number;

  constructor(data: CumulativeSeasonEntity) {
    Object.assign(this, data);
  }
}
