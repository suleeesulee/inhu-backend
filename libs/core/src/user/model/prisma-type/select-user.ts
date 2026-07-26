import { SELECT_PLACE_OWNER } from './select-place-owner';
import { SELECT_USER_EMAIL } from './select-user-email';
import { SELECT_USER_PROVIDER } from './select-user-provider';
import { Prisma } from '@prisma/client';

export const SELECT_USER = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
    createdAt: true,
    userProvider: SELECT_USER_PROVIDER,
    userEmail: SELECT_USER_EMAIL,
    placeOwnerList: SELECT_PLACE_OWNER,
  },
});

export type SelectUser = Prisma.UserGetPayload<typeof SELECT_USER>;
