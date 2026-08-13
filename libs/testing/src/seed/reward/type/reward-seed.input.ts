/**
 * Reward 시드 입력 타입 정의
 *
 * @publicApi
 */
export type RewardSeedInput = {
  name?: string;
  imagePath?: string | null;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
};
