import { Prisma } from '@prisma/client';
import { SELECT_NOTIFICATION } from './select-notification';

export const SELECT_USER_NOTIFICATION =
  Prisma.validator<Prisma.UserNotificationDefaultArgs>()({
    select: {
      notificationId: true,
      userIdx: true,
      createdAt: true,
      notification: SELECT_NOTIFICATION,
    },
  });

export type SelectUserNotification = Prisma.UserNotificationGetPayload<
  typeof SELECT_USER_NOTIFICATION
>;
