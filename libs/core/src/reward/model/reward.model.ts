import { SelectReward } from './prisma-type/select-reward';

export class RewardModel {
  /**
   * 리워드 식별자
   */
  public idx: number;

  /**
   * 리워드 이름
   */
  public name: string;

  /**
   * 리워드 이미지 경로
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

  constructor(data: RewardModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(reward: SelectReward): RewardModel {
    return new RewardModel({
      idx: reward.idx,
      name: reward.name,
      imagePath: reward.imagePath,
      activatedAt: reward.activatedAt,
      createdAt: reward.createdAt,
    });
  }
}
