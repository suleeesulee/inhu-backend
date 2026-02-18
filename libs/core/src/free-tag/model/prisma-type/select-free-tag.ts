import { Prisma } from '@prisma/client';

export const SELECT_FREE_TAG = Prisma.validator<Prisma.FreeTagDefaultArgs>()({
  select: {
    idx: true,
    content: true,
    createdAt: true,
  },
});

export type SelectFreeTag = Prisma.FreeTagGetPayload<typeof SELECT_FREE_TAG>;
