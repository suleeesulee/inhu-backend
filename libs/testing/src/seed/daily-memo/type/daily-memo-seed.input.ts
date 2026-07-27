/**
 * daily memo 시드 입력 타입 정의
 *
 * @publicApi
 */
export type DailyMemoSeedInput = {
  cafeteriaIdx: number;
  content?: string;
  date?: Date;
  deletedAt?: Date | null;
};
