import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { MealOfferingSeedInput } from './meal-offering-seed.input';

/**
 * meal offering 시드 출력 타입정의
 *
 * @publicApi
 */
export type MealOfferingSeedOutput = FilledSeedInput<MealOfferingSeedInput> & {
  idx: number;
};
