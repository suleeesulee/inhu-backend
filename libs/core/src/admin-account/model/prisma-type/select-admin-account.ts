import { Prisma } from '@prisma/client';
import { SELECT_ADMIN_USER } from './select-admin-user';

export const SELECT_ADMIN_ACCOUNT =
  Prisma.validator<Prisma.AdminAccountDefaultArgs>()({
    select: {
      idx: true,
      id: true,
      pw: true,
      role: true,
      user: {
        select: SELECT_ADMIN_USER.select,
      },
    },
  });

export type SelectAdminAccount = Prisma.AdminAccountGetPayload<
  typeof SELECT_ADMIN_ACCOUNT
>;
