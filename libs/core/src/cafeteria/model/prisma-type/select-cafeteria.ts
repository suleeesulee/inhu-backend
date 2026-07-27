import { Prisma } from '@prisma/client';

export const SELECT_CAFETERIA = Prisma.validator<Prisma.CafeteriaDefaultArgs>()(
  {
    select: {
      idx: true,
      name: true,
      createdAt: true,
    },
  },
);

export type SelectCafeteria = Prisma.CafeteriaGetPayload<
  typeof SELECT_CAFETERIA
>;
