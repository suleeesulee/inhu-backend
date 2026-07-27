/**
 * Review 시드 입력 타입 정의
 *
 * @publicApi
 */
export type ReviewSeedInput = {
  userIdx: number;
  placeIdx: number;
  deletedAt?: Date | null;
  content?: string;
  reviewImgList?: string[] | null;
  keywordIdxList?: [number, ...number[]] | null;
};
