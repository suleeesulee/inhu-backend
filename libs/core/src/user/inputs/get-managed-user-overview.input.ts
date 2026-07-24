/**
 * @publicApi
 */
export class GetManagedUserOverviewInput {
  /**
   * 건너뛸 데이터의 개수 (페이지네이션용)
   */
  skip: number;

  /**
   * 가져올 데이터의 개수 (페이지네이션용)
   */
  take: number;
}
