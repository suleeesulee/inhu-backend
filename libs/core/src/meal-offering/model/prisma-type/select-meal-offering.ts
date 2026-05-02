import { Prisma } from '@prisma/client';
import { SELECT_MEAL_ITEM } from './select-meal-item';

export const SELECT_MEAL_OFFERING =
  Prisma.validator<Prisma.MealOfferingDefaultArgs>()({
    select: {
      idx: true,
      foodStationIdx: true,
      startTime: true,
      endTime: true,
      kcal: true,
      servedDate: true,
      createdAt: true,
      mealItemList: SELECT_MEAL_ITEM,
    },
  });

export type SelectMealOffering = Prisma.MealOfferingGetPayload<
  typeof SELECT_MEAL_OFFERING
>;
