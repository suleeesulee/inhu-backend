import { Prisma } from '@prisma/client';

export const SELECT_NOTICE = Prisma.validator<Prisma.NoticeDefaultArgs>()({
  select: {
    idx: true,
    authorIdx: true,
    title: true,
    content: true,
    createdAt: true,
  },
});

export type SelectNotice = Prisma.NoticeGetPayload<typeof SELECT_NOTICE>;
