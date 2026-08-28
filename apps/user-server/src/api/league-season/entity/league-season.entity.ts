import { LeagueSeasonModel } from '@libs/core/league-season/model/league-season.model';
import { LeagueRewardOptionEntity } from './league-reward-option.entity';

export class LeagueSeasonEntity {
  /**
   * league season 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * league season 이름
   *
   * @example '2026년 5월 세 번째 시즌'
   */
  public name: string;

  /**
   * league season 시작일
   */
  public startAt: Date;

  /**
   * league season 종료일
   */
  public endAt: Date;

  /**
   * 활성화 일자
   */
  public activatedAt: Date | null;

  /**
   * 생성 일자
   */
  public createdAt: Date;

  /**
   * league season 참여자 수
   *
   * @example 100
   */
  public seasonRankingParticipantCount: number;

  /**
   * 누적 league season 참여자 수
   *
   * @example 500
   */
  public cumulativeRankingParticipantCount: number;

  /**
   * league season 보상 옵션 리스트
   */
  public rewardOptionList: LeagueRewardOptionEntity[];

  constructor(data: LeagueSeasonEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonModel,
    seasonRankingParticipantCount: number,
    cumulativeRankingParticipantCount: number,
  ): LeagueSeasonEntity {
    return new LeagueSeasonEntity({
      idx: model.idx,
      name: model.name,
      startAt: model.startAt,
      endAt: model.endAt,
      activatedAt: model.activatedAt,
      createdAt: model.createdAt,
      seasonRankingParticipantCount,
      cumulativeRankingParticipantCount,
      rewardOptionList: model.rewardOptionList.map((rewardOption) =>
        LeagueRewardOptionEntity.fromModel(rewardOption),
      ),
    });
  }
}
