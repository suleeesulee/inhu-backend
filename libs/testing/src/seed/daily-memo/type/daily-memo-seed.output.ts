import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { DailyMemoSeedInput } from './daily-memo-seed.input';

/**
 * daily memo 시드 출력 타입정의
 *
 * @publicApi
 */
export type DailyMemoSeedOutput = FilledSeedInput<DailyMemoSeedInput> & {
  idx: number;
};
