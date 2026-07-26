import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { ManagedUserSeedInput } from './managed-user-seed.input';

/**
 * Managed 유저 시드 출력 타입 정의
 *
 * @publicApi
 */
export type ManagedUserSeedOutput = FilledSeedInput<ManagedUserSeedInput> & {
  idx: number;
};
