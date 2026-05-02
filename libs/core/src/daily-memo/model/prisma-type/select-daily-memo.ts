import { Prisma } from '@prisma/client';

export const SELECT_DAILY_MEMO =
  Prisma.validator<Prisma.DailyMemoDefaultArgs>()({
    select: {
      idx: true,
      cafeteriaIdx: true,
      content: true,
      date: true,
      createdAt: true,
    },
  });

export type SelectDailyMemo = Prisma.DailyMemoGetPayload<
  typeof SELECT_DAILY_MEMO
>;
