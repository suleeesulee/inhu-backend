import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';
import { NfcSeedInput } from './nfc-seed.input';

/**
 * NFC 시드 출력 타입 정의
 *
 * @publicApi
 */
export type NfcSeedOutput = FilledSeedInput<NfcSeedInput> & {
  idx: number;
};
