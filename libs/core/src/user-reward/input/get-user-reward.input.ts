export class GetUserRewardInput {
  public take: number;
  public skip: number;

  /**
   * 발솔대기 중인 보상 필터링 여부
   *
   * - true : 발솔대기 중인 보상만 조회
   * - undefined : 발솔대기 중인 보상 여부 상관없이 조회
   */
  public issued?: boolean;
}
