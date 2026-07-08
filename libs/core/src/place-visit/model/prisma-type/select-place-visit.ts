import { Prisma } from '@prisma/client';

export const SELECT_PLACE_VISIT =
  Prisma.validator<Prisma.PlaceVisitDefaultArgs>()({
    select: {
      id: true,
      userIdx: true,
      nfcIdx: true,
      score: true,
      createdAt: true,
    },
  });

export type SelectPlaceVisit = Prisma.PlaceVisitGetPayload<
  typeof SELECT_PLACE_VISIT
>;
