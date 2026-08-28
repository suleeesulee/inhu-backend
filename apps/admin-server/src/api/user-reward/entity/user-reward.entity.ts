import { LeagueSeasonResultEntity } from '@admin/api/league-season/entity/league-season-result.entity';
import { RewardEntity } from '@admin/api/reward/entity/reward.entity';
import { UserEntity } from '@admin/api/user/entity/user.entity';
import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { RewardModel } from '@libs/core/reward/model/reward.model';
import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';
import { UserModel } from '@libs/core/user/model/user.model';

export class UserRewardEntity {
  /**
   * 사용자 리워드 고유 식별자
   *
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  public id: string;

  /**
   * 생성 일자
   */
  public createdAt: Date;

  /**
   * 선택 일자
   */
  public selectedAt: Date | null;

  /**
   * 발급 일자
   */
  public issuedAt: Date | null;

  /**
   * 보상 정보
   */
  public reward: RewardEntity | null;

  /**
   * 리그 시즌 결과 정보
   */
  public leagueSeasonResult: LeagueSeasonResultEntity;

  /**
   * 사용자 정보
   */
  public user: UserEntity;

  constructor(data: UserRewardEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: UserRewardModel,
    leagueSeasonResult: LeagueSeasonResultModel,
    user: UserModel,
    reward: RewardModel | null,
  ): UserRewardEntity {
    return new UserRewardEntity({
      id: model.id,
      createdAt: model.createdAt,
      selectedAt: model.selectedAt,
      issuedAt: model.issuedAt,
      reward: reward ? RewardEntity.fromModel(reward) : null,
      leagueSeasonResult:
        LeagueSeasonResultEntity.fromModel(leagueSeasonResult),
      user: UserEntity.fromModel(user),
    });
  }
}
