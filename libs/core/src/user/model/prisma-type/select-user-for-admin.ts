import { Prisma } from '@prisma/client';
import { SELECT_USER_PROVIDER } from './select-user-provider';
import { SELECT_USER_EMAIL } from './select-user-email';

export const SELECT_USER_FOR_ADMIN = Prisma.validator<Prisma.UserDefaultArgs>()(
  {
    select: {
      idx: true,
      nickname: true,
      profileImagePath: true,
      createdAt: true,
      userProvider: SELECT_USER_PROVIDER,
      userEmail: SELECT_USER_EMAIL,
      _count: {
        select: {
          reviewList: true,
        },
      },
    },
  },
);

export type SelectUserForAdmin = Prisma.UserGetPayload<
  typeof SELECT_USER_FOR_ADMIN
>;
