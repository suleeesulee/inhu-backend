import { UserRankingModel } from '@libs/core/user-ranking/model/user-ranking.model';

export class UserRankingEntity {
  /**
   * User index
   *
   * @example 1
   */
  public userIdx: number;

  /**
   * User nickname
   *
   * @example "JohnDoe"
   */
  public nickname: string;

  /**
   * 시즌 랭킹
   *
   * @example 1
   */
  public seasonRank: number | null;

  /**
   * 시즌 점수
   *
   * @example 1000
   */
  public seasonScore: number;

  /**
   * 시즌 내 가장 최근 방문 일시
   */
  public seasonLatestVisitAt: Date | null;

  /**
   * 누적 랭킹
   *
   * @example 1
   */
  public cumulativeRank: number | null;

  /**
   * 누적 점수
   *
   * @example 5000
   */
  public cumulativeScore: number;

  /**
   * 누적 기준 가장 최근 방문 일시
   */
  public cumulativeLatestVisitAt: Date | null;

  constructor(data: UserRankingEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserRankingModel): UserRankingEntity {
    return new UserRankingEntity({
      userIdx: model.userIdx,
      nickname: model.nickname,
      seasonRank: model.seasonRank,
      seasonScore: model.seasonScore,
      seasonLatestVisitAt: model.seasonLatestVisitAt,
      cumulativeRank: model.cumulativeRank,
      cumulativeScore: model.cumulativeScore,
      cumulativeLatestVisitAt: model.cumulativeLatestVisitAt,
    });
  }
}
