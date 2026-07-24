import { Prisma } from '@prisma/client';

export const SELECT_MANAGED_USER = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    profileImagePath: true,
    createdAt: true,
  },
});

export type SelectManagedUser = Prisma.UserGetPayload<
  typeof SELECT_MANAGED_USER
>;
