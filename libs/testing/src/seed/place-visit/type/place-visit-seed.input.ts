/**
 * Place visit 시드 입력 타입 정의
 *
 * @publicApi
 */
export type PlaceVisitSeedInput = {
  userIdx: number;
  nfcIdx: number;
  score?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  deletedAt?: Date | null;
};
