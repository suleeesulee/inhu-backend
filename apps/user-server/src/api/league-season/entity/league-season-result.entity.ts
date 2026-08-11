import { PlaceVisitStatisticEntity } from '@user/api/place-visit/entity/place-visit-statistic.entity';
import { LeagueSeasonResultUserRankingEntity } from './league-season-result-user-ranking.entity';
import { LeagueSeasonEntity } from './league-season.entity';
import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { UserRewardEntity } from '@user/api/user-reward/entity/user-reward.entity';
import { LeagueSeasonResultUserRankingModel } from '@libs/core/league-season/model/league-season-result-user-ranking.model';
import { PlaceVisitStatisticModel } from '@libs/core/place-visit/model/place-visit-statistic.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';

export class LeagueSeasonResultEntity {
  /**
   * 리그 시즌 결과 ID
   *
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  public id: string;

  /**
   * 리그 시즌 결과 생성일 (배치 처리된 시간)
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

  /**
   * 리그 시즌 결과 사용자 랭킹 정보
   */
  public userRanking: LeagueSeasonResultUserRankingEntity;

  /**
   * 리그 시즌 결과 사용자 방문 통계 정보
   */
  public placeVisitStatisticList: PlaceVisitStatisticEntity[];

  /**
   * 리그 시즌 결과 사용자 보상 정보
   */
  public userReward: UserRewardEntity;

  constructor(data: LeagueSeasonResultEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: LeagueSeasonResultModel,
    userRanking: LeagueSeasonResultUserRankingModel,
    placeVisitStatisticList: PlaceVisitStatisticModel[],
    userReward: UserRewardModel,
  ): LeagueSeasonResultEntity {
    return new LeagueSeasonResultEntity({
      id: model.id,
      createdAt: model.createdAt,
      leagueSeason: LeagueSeasonEntity.fromModel(model.leagueSeason),
      participantCount: model.participantCount,
      userRanking: LeagueSeasonResultUserRankingEntity.fromModel(userRanking),
      placeVisitStatisticList: placeVisitStatisticList.map((stat) =>
        PlaceVisitStatisticEntity.fromModel(stat),
      ),
      userReward: UserRewardEntity.fromModel(userReward),
    });
  }
}
