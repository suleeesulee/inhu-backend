import { UserRewardModel } from '@libs/core/user-reward/model/user-reward.model';

export class UserRewardEntity {
  /**
   * user reward 식별자
   *
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  public id: string;

  /**
   * reward 식별자
   *
   * @example 1
   */
  public rewardIdx: number | null;

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

  constructor(data: UserRewardEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserRewardModel): UserRewardEntity {
    return new UserRewardEntity({
      id: model.id,
      rewardIdx: model.rewardIdx,
      createdAt: model.createdAt,
      selectedAt: model.selectedAt,
      issuedAt: model.issuedAt,
    });
  }
}
