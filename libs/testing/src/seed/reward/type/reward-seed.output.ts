import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { RewardSeedInput } from './reward-seed.input';

/**
 * Reward 시드 출력 타입 정의
 *
 * @publicApi
 */
export type RewardSeedOutput = FilledSeedInput<RewardSeedInput> & {
  idx: number;
};
