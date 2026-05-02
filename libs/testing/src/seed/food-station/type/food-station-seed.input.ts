import { MealType } from '@libs/core/food-station/constants/meal-type.constant';

/**
 * food station 시드 입력 타입 정의
 *
 * @publicApi
 */
export type FoodStationSeedInput = {
  cafeteriaIdx: number;
  mealType?: MealType;
  name?: string | null;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  mealOfferingList?:
    | {
        foodStationIdx: number;
        startTime?: string;
        endTime?: string;
        kcal?: number | null;
        servedDate?: string;
        mealItemList?: {
          name?: string;
          price?: number;
          deletedAt?: Date | null;
        }[];
        deletedAt?: Date | null;
      }[]
    | null;
  deletedAt?: Date | null;
};
