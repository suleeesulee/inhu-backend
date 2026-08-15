import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { LeagueSeasonEntity } from './league-season.entity';

export class LeagueSeasonResultEntity {
  /**
   * 리그 시즌 결과 ID
   *
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  public id: string;

  /**
   * 리그 시즌 결과 생성일 (배치 처리된 시간)
   *
   * @example "2026-05-15T12:34:56.789Z"
   */
  public createdAt: Date;

  /**
   * 리그 시즌 정보
   */
  public leagueSeason: LeagueSeasonEntity;

  /**
   * 리그 시즌 참여자 수
   *
   * @example 100
   */
  public participantCount: number;

  constructor(data: LeagueSeasonResultEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultModel,
  ): LeagueSeasonResultEntity {
    return new LeagueSeasonResultEntity({
      id: model.id,
      createdAt: model.createdAt,
      leagueSeason: LeagueSeasonEntity.fromModel(model.leagueSeason),
      participantCount: model.participantCount,
    });
  }
}
