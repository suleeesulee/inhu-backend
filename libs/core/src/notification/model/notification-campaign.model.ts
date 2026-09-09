import { NotificationModel } from './notification.model';
import { SelectNotificationCampaign } from './prisma-type/select-notification-campaign';

/**
 * @publicApi
 */
export class NotificationCampaignModel {
  public id: string;
  public notificationId: string;
  public targetCount: number;
  public successCount: number;
  public failCount: number;
  public completedAt: Date | null;
  public createdAt: Date;
  public notification: NotificationModel;

  constructor(data: NotificationCampaignModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    campaign: SelectNotificationCampaign,
  ): NotificationCampaignModel {
    return new NotificationCampaignModel({
      id: campaign.id,
      notificationId: campaign.notificationId,
      targetCount: campaign.targetCount,
      successCount: campaign.successCount,
      failCount: campaign.failCount,
      completedAt: campaign.completedAt,
      createdAt: campaign.createdAt,
      notification: NotificationModel.fromPrisma(campaign.notification),
    });
  }
}
