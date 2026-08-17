import { Prisma } from '@prisma/client';
import { SELECT_NOTICE_AUTHOR } from './select-notice-author';

export const SELECT_NOTICE = Prisma.validator<Prisma.NoticeDefaultArgs>()({
  select: {
    idx: true,
    authorIdx: true,
    title: true,
    content: true,
    createdAt: true,
    author: SELECT_NOTICE_AUTHOR,
  },
});

export type SelectNotice = Prisma.NoticeGetPayload<typeof SELECT_NOTICE>;
