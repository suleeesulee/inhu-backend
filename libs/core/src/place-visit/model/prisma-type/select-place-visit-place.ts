import { Prisma } from '@prisma/client';

export const SELECT_PLACE_VISIT_PLACE =
  Prisma.validator<Prisma.PlaceDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      roadAddress: {
        select: {
          idx: true,
          addressName: true,
          detailAddress: true,
          addressX: true,
          addressY: true,
        },
      },
      placeImageList: {
        select: {
          path: true,
        },
        where: {
          deletedAt: null,
        },
        orderBy: {
          idx: 'asc',
        },
      },
    },
  });

export type SelectPlaceVisitPlace = Prisma.PlaceGetPayload<
  typeof SELECT_PLACE_VISIT_PLACE
>;
