import { Prisma } from '@prisma/client';
import { SELECT_NOTIFICATION } from './select-notification';

export const SELECT_LOGIN_USER_NOTIFICATION =
  Prisma.validator<Prisma.LoginUserNotificationDefaultArgs>()({
    select: {
      notificationId: true,
      userIdx: true,
      createdAt: true,
      notification: SELECT_NOTIFICATION,
    },
  });

export type SelectLoginUserNotification =
  Prisma.LoginUserNotificationGetPayload<typeof SELECT_LOGIN_USER_NOTIFICATION>;
