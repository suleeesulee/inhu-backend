import { Prisma } from '@prisma/client';

export const SELECT_SEARCH_TAG =
  Prisma.validator<Prisma.SearchTagDefaultArgs>()({
    select: {
      idx: true,
      content: true,
      createdAt: true,
    },
  });

export type SelectSearchTag = Prisma.SearchTagGetPayload<
  typeof SELECT_SEARCH_TAG
>;
