import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { FreeTagSeedInput } from './free-tag-seed.input';

/**
 * free-tag 시드 출력 타입정의
 *
 * @publicApi
 */
export type FreeTagSeedOutput = FilledSeedInput<FreeTagSeedInput> & {
  idx: number;
};
