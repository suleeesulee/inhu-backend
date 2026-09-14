/**
 * NFC 시드 입력 타입 정의
 *
 * @publicApi
 */
export type NfcSeedInput = {
  placeIdx: number;
  score?: number;
  uid?: string;
  cooldown?: number;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
};
