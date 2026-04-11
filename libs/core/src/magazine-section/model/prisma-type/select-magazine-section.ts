import { Prisma } from '@prisma/client';

export const SELECT_MAGAZINE_SECTION =
  Prisma.validator<Prisma.MagazineSectionDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      parameter: true,
      sortOrder: true,
      createdAt: true,
    },
  });

export type SelectMagazineSection = Prisma.MagazineSectionGetPayload<
  typeof SELECT_MAGAZINE_SECTION
>;
