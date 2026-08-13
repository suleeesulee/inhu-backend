import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { PlaceVisitSeedInput } from './place-visit-seed.input';

/**
 * Place visit 시드 출력 타입 정의
 *
 * @publicApi
 */
export type PlaceVisitSeedOutput = FilledSeedInput<PlaceVisitSeedInput> & {
  id: string;
};
