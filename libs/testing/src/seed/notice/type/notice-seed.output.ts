import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { NoticeSeedInput } from './notice-seed.input';

/**
 * notice 시드 출력 타입 정의
 *
 * @publicApi
 */
export type NoticeSeedOutput = FilledSeedInput<NoticeSeedInput> & {
  idx: number;
};
