/**
 * League season 시드 입력 타입 정의
 *
 * @publicApi
 */
export type LeagueSeasonSeedInput = {
  name?: string;
  createdAt?: Date;
  startAt?: Date;
  endAt?: Date;
  activatedAt?: Date | null;
  finalizedAt?: Date | null;
  rewardOptionList?:
    | {
        rewardIdx: number;
        targetRank?: number;
        deletedAt?: Date | null;
      }[]
    | null;
};
