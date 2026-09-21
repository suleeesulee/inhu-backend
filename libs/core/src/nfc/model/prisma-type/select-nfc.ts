import { Prisma } from '@prisma/client';
import { SELECT_NFC_PLACE } from './select-nfc-place';

export const SELECT_NFC = Prisma.validator<Prisma.NfcDefaultArgs>()({
  select: {
    idx: true,
    placeIdx: true,
    score: true,
    uid: true,
    cooldown: true,
    activatedAt: true,
    createdAt: true,
    place: SELECT_NFC_PLACE,
  },
});

export type SelectNfc = Prisma.NfcGetPayload<typeof SELECT_NFC>;
