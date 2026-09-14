import { Prisma } from '@prisma/client';

export const SELECT_NFC = Prisma.validator<Prisma.NfcDefaultArgs>()({
  select: {
    idx: true,
    placeIdx: true,
    score: true,
    uid: true,
    cooldown: true,
    activatedAt: true,
    createdAt: true,
  },
});

export type SelectNfc = Prisma.NfcGetPayload<typeof SELECT_NFC>;
