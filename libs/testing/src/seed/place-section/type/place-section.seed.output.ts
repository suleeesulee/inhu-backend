import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PlaceSectionSeedInput } from './place-section-seed.input';

/**
 * place section 시드 출력 타입 정의
 *
 * @publicApi
 */
export type PlaceSectionSeedOutput = FilledSeedInput<PlaceSectionSeedInput> & {
  idx: number;
  sortOrder: number;
};
