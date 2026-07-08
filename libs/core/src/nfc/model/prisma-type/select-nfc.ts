import { Prisma } from '@prisma/client';

export const SELECT_NFC = Prisma.validator<Prisma.NfcDefaultArgs>()({
  select: {
    idx: true,
    placeIdx: true,
    score: true,
    tokenHash: true,
    activatedAt: true,
    createdAt: true,
  },
});

export type SelectNfc = Prisma.NfcGetPayload<typeof SELECT_NFC>;
