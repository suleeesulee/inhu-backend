import { Prisma } from '@prisma/client';

export const SELECT_MEAL_ITEM = Prisma.validator<Prisma.MealItemDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    price: true,
    createdAt: true,
  },
});

export type SelectMealItem = Prisma.MealItemGetPayload<typeof SELECT_MEAL_ITEM>;
