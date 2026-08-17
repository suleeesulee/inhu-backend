import { Prisma } from '@prisma/client';

export const SELECT_NOTICE_AUTHOR = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
  },
});

export type SelectNoticeAuthor = Prisma.UserGetPayload<
  typeof SELECT_NOTICE_AUTHOR
>;
