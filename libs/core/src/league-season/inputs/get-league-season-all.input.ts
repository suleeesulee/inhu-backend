export class GetLeagueSeasonAllInput {
  /**
   * 한 번에 가져올 개수
   */
  public take: number;

  /**
   * 스킵할 데이터의 개수
   */
  public skip: number;

  /**
   * 정렬 방향
   */
  public order?: 'asc' | 'desc';
}
