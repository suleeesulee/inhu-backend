export class PageViewHistoryEntity {
  /**
   * @example (tabs)
   */
  screenName: string;

  /**
   * 이벤트 발생 수
   *
   * @example 10
   */
  count: number;

  constructor(data: PageViewHistoryEntity) {
    Object.assign(this, data);
  }

  public static from(data: { screenName: string; count: number }) {
    return new PageViewHistoryEntity(data);
  }
}
