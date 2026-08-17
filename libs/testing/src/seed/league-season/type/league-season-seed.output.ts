import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { LeagueSeasonSeedInput } from './league-season-seed.input';

/**
 * League season 시드 출력 타입 정의
 *
 * @publicApi
 */
export type LeagueSeasonSeedOutput = FilledSeedInput<LeagueSeasonSeedInput> & {
  idx: number;
};
