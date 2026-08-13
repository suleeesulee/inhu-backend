/**
 * League season 시드 입력 타입 정의
 *
 * @publicApi
 */
export type LeagueSeasonSeedInput = {
  name?: string;
  startAt?: Date;
  endAt?: Date;
  finalizedAt?: Date | null;
  rewardOptionList?:
    | {
        rewardIdx: number;
        targetRank?: number;
        deletedAt?: Date | null;
      }[]
    | null;
};
