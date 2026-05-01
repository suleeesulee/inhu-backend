import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { CafeteriaSeedInput } from './cafeteria-seed.input';

/**
 * cafeteria 시드 출력 타입정의
 *
 * @publicApi
 */
export type CafeteriaSeedOutput = FilledSeedInput<CafeteriaSeedInput> & {
  idx: number;
};
