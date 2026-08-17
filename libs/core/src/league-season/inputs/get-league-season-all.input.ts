export class GetLeagueSeasonAllInput {
  /**
   * 한 번에 가져올 개수
   */
  public take?: number;

  /**
   * 스킵할 데이터의 개수
   */
  public skip?: number;

  /**
   * 정렬 방향
   */
  public order?: 'asc' | 'desc';

  /**
   * 활성화 여부
   */
  public activated?: boolean;

  /**
   * 종료일이 특정 날짜 이전인 리그 시즌만 가져오기
   */
  public endAtBefore?: Date;

  /**
   * 배치 처리 완료 여부
   */
  public finalized?: boolean;
}
