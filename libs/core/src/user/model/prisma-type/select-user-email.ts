import { Prisma } from '@prisma/client';

export const SELECT_USER_EMAIL =
  Prisma.validator<Prisma.UserEmailDefaultArgs>()({
    select: {
      schoolEmailEncrypted: true,
      createdAt: true,
    },
  });

export type SelectUserEmail = Prisma.UserEmailGetPayload<
  typeof SELECT_USER_EMAIL
>;
