import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { UserRewardSeedInput } from './user-reward-seed.input';

/**
 * User reward 시드 출력 타입 정의
 *
 * @publicApi
 */
export type UserRewardSeedOutput = FilledSeedInput<UserRewardSeedInput> & {
  id: string;
};
