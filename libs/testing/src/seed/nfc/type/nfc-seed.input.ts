/**
 * NFC 시드 입력 타입 정의
 *
 * @publicApi
 */
export type NfcSeedInput = {
  placeIdx: number;
  score?: number;
  uid?: string;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
};
