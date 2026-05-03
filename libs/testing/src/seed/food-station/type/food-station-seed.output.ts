import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { FoodStationSeedInput } from './food-station-seed.input';

/**
 * food station 시드 출력 타입정의
 *
 * @publicApi
 */
export type FoodStationSeedOutput = FilledSeedInput<FoodStationSeedInput> & {
  idx: number;
};
