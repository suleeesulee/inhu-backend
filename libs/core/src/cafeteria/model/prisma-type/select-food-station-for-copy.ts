import { Prisma } from '@prisma/client';

export const SELECT_FOOD_STATION_FOR_COPY =
  Prisma.validator<Prisma.FoodStationDefaultArgs>()({
    select: {
      mealTypeIdx: true,
      name: true,
      startTime: true,
      endTime: true,
      startDate: true,
      endDate: true,
      mealOfferingList: {
        select: {
          startTime: true,
          endTime: true,
          kcal: true,
          servedDate: true,
          mealItemList: {
            select: {
              name: true,
              price: true,
            },
            where: { deletedAt: null },
          },
        },
      },
    },
  });

export type SelectFoodStationForCopy = Prisma.FoodStationGetPayload<
  typeof SELECT_FOOD_STATION_FOR_COPY
>;
