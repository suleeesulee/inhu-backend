import { LeagueRewardOptionModel } from './league-reward-option.model';
import { SelectLeagueSeason } from './prisma-type/select-league-season';

export class LeagueSeasonModel {
  /**
   * league season 식별자
   */
  public idx: number;

  /**
   * league season 이름
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
   * 배치 처리된 시간
   */
  public finalizedAt: Date | null;

  /**
   * league season 보상 옵션 리스트
   */
  public rewardOptionList: LeagueRewardOptionModel[];

  constructor(data: LeagueSeasonModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    leagueSeason: SelectLeagueSeason,
  ): LeagueSeasonModel {
    return new LeagueSeasonModel({
      idx: leagueSeason.idx,
      name: leagueSeason.name,
      startAt: leagueSeason.startAt,
      endAt: leagueSeason.endAt,
      activatedAt: leagueSeason.activatedAt,
      createdAt: leagueSeason.createdAt,
      finalizedAt: leagueSeason.finalizedAt,
      rewardOptionList: leagueSeason.rewardOptionList.map((rewardOption) =>
        LeagueRewardOptionModel.fromPrisma(rewardOption),
      ),
    });
  }
}
