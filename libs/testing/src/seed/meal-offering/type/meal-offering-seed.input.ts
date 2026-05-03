/**
 * meal offering 시드 입력 타입 정의
 *
 * @publicApi
 */
export type MealOfferingSeedInput = {
  foodStationIdx: number;
  startTime?: Date;
  endTime?: Date;
  kcal?: number | null;
  servedDate?: Date;
  mealItemList?: {
    name?: string;
    price?: number;
    deletedAt?: Date | null;
  }[];
  deletedAt?: Date | null;
};
