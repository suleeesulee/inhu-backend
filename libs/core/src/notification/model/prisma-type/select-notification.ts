import { Prisma } from '@prisma/client';

export const SELECT_NOTIFICATION =
  Prisma.validator<Prisma.NotificationDefaultArgs>()({
    select: {
      id: true,
      title: true,
      content: true,
      pageType: true,
      createdAt: true,
    },
  });

export type SelectNotification = Prisma.NotificationGetPayload<
  typeof SELECT_NOTIFICATION
>;
