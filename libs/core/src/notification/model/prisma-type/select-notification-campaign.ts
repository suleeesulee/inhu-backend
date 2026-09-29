import { Prisma } from '@prisma/client';
import { SELECT_NOTIFICATION } from './select-notification';

export const SELECT_NOTIFICATION_CAMPAIGN =
  Prisma.validator<Prisma.NotificationCampaignDefaultArgs>()({
    select: {
      id: true,
      notificationId: true,
      targetCount: true,
      successCount: true,
      failCount: true,
      completedAt: true,
      createdAt: true,
      notification: SELECT_NOTIFICATION,
    },
  });

export type SelectNotificationCampaign = Prisma.NotificationCampaignGetPayload<
  typeof SELECT_NOTIFICATION_CAMPAIGN
>;
