import { Prisma } from '@prisma/client';

export const SELECT_NOTICE_OVERVIEW =
  Prisma.validator<Prisma.NoticeDefaultArgs>()({
    select: {
      idx: true,
      authorIdx: true,
      title: true,
      createdAt: true,
    },
  });

export type SelectNoticeOverview = Prisma.NoticeGetPayload<
  typeof SELECT_NOTICE_OVERVIEW
>;
