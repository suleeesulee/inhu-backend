import { Prisma } from '@prisma/client';

export const SELECT_ADMIN_USER = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    nickname: true,
  },
});

export type SelectAdminUser = Prisma.UserGetPayload<typeof SELECT_ADMIN_USER>;
