import { RewardModel } from '@libs/core/reward/model/reward.model';

export class RewardEntity {
  /**
   * 리워드 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 리워드 이름
   *
   * @example "스타벅스 아메리카노 1잔"
   */
  public name: string;

  /**
   * 리워드 이미지 경로
   *
   * @example "/images/rewards/starbucks_coffee.jpg"
   */
  public imagePath: string | null;

  /**
   * 리워드 활성화 시간
   */
  public activatedAt: Date | null;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: RewardEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: RewardModel): RewardEntity {
    return new RewardEntity({
      idx: model.idx,
      name: model.name,
      imagePath: model.imagePath,
      activatedAt: model.activatedAt,
      createdAt: model.createdAt,
    });
  }
}
