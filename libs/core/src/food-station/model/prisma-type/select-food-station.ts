import { SELECT_MEAL_OFFERING } from '@libs/core/meal-offering/model/prisma-type/select-meal-offering';
import { Prisma } from '@prisma/client';

export const SELECT_FOOD_STATION =
  Prisma.validator<Prisma.FoodStationDefaultArgs>()({
    select: {
      idx: true,
      cafeteriaIdx: true,
      mealTypeIdx: true,
      name: true,
      startTime: true,
      endTime: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      mealOfferingList: SELECT_MEAL_OFFERING,
    },
  });

export type SelectFoodStation = Prisma.FoodStationGetPayload<
  typeof SELECT_FOOD_STATION
>;
