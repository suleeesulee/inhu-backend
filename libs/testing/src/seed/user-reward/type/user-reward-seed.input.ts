/**
 * User reward 시드 입력 타입 정의
 *
 * @publicApi
 */
export type UserRewardSeedInput = {
  leagueSeasonResultId: string;
  rewardIdx?: number | null;
  selectedAt?: Date | null;
  issuedAt?: Date | null;
};
