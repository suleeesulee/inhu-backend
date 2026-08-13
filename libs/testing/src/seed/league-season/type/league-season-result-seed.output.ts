import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { LeagueSeasonResultSeedInput } from './league-season-result-seed.input';

/**
 * League season result 시드 출력 타입 정의
 *
 * @publicApi
 */
export type LeagueSeasonResultSeedOutput =
  FilledSeedInput<LeagueSeasonResultSeedInput> & {
    id: string;
  };
