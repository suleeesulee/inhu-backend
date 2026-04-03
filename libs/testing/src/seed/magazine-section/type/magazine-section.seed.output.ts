import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MagazineSectionSeedInput } from './magazine-section-seed.input';

/**
 * magazine section 시드 출력 타입 정의
 *
 * @publicApi
 */
export type MagazineSectionSeedOutput =
  FilledSeedInput<MagazineSectionSeedInput> & {
    idx: number;
  };
