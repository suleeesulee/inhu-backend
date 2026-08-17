import { Prisma } from '@prisma/client';
import { SELECT_PLACE_VISIT_PLACE } from './select-place-visit-place';

export const SELECT_PLACE_VISIT =
  Prisma.validator<Prisma.PlaceVisitDefaultArgs>()({
    select: {
      id: true,
      userIdx: true,
      nfcIdx: true,
      score: true,
      createdAt: true,
      nfc: {
        select: {
          place: SELECT_PLACE_VISIT_PLACE,
        },
      },
    },
  });

export type SelectPlaceVisit = Prisma.PlaceVisitGetPayload<
  typeof SELECT_PLACE_VISIT
>;
