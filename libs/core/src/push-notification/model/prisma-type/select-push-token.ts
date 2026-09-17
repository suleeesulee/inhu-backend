import { Prisma } from '@prisma/client';

export const SELECT_PUSH_TOKEN =
  Prisma.validator<Prisma.PushTokenDefaultArgs>()({
    select: {
      id: true,
      expoPushToken: true,
      lastSeenAt: true,
      createdAt: true,
      installation: {
        select: {
          userIdx: true,
          platform: true,
        },
      },
    },
  });

export type SelectPushToken = Prisma.PushTokenGetPayload<
  typeof SELECT_PUSH_TOKEN
>;
