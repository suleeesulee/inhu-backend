import { Prisma } from '@prisma/client';
import { SELECT_NOTICE_AUTHOR } from './select-notice-author';

export const SELECT_NOTICE_OVERVIEW =
  Prisma.validator<Prisma.NoticeDefaultArgs>()({
    select: {
      idx: true,
      authorIdx: true,
      title: true,
      createdAt: true,
      author: SELECT_NOTICE_AUTHOR,
    },
  });

export type SelectNoticeOverview = Prisma.NoticeGetPayload<
  typeof SELECT_NOTICE_OVERVIEW
>;
