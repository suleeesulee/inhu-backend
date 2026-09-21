import { SELECT_PLACE_ROAD_ADDRESS } from '@libs/core/place/model/prisma-type/select-place-road-address';
import { Prisma } from '@prisma/client';

export const SELECT_NFC_PLACE = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    tel: true,
    roadAddress: SELECT_PLACE_ROAD_ADDRESS,
    placeImageList: {
      select: { path: true },
      where: { deletedAt: null },
      orderBy: { idx: 'asc' },
    },
  },
});

export type SelectNfcPlace = Prisma.PlaceGetPayload<typeof SELECT_NFC_PLACE>;
