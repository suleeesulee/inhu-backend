/**
 * League season result 시드 입력 타입 정의
 *
 * @publicApi
 */
export type LeagueSeasonResultSeedInput = {
  leagueSeasonIdx: number;
  userIdx: number;
  finalScore?: number;
};
