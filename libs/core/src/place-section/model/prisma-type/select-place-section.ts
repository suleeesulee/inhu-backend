import { Prisma } from '@prisma/client';

export const SELECT_PLACE_SECTION =
  Prisma.validator<Prisma.PlaceSectionDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      parameter: true,
      createdAt: true,
    },
  });

export type SelectPlaceSection = Prisma.PlaceSectionGetPayload<
  typeof SELECT_PLACE_SECTION
>;
