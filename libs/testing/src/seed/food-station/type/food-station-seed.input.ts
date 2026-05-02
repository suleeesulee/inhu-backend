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
  startTime?: Date;
  endTime?: Date;
  startDate?: Date;
  endDate?: Date;
  mealOfferingList?:
    | {
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
      }[]
    | null;
  deletedAt?: Date | null;
};
