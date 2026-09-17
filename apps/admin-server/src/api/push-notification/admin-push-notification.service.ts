import { PushNotificationService } from '@libs/common/modules/push-notification/push-notification.service';
import { ApnsDeviceTokenUnregisteredException } from '@libs/common/modules/push-notification/provider/apns/apns-push-notification.provider';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SendPushNotificationDto } from './dto/request/send-push-notification.dto';
import { PushTokenCoreService } from '@libs/core/push-notification/push-token-core.service';
import { InstallationLifecycleCoreService } from '@libs/core/installation-lifecycle/installation-lifecycle-core.service';
import { KafkaProducerService } from '@libs/common/modules/kafka/kafka-producer.service';
import { NotificationCampaignRequestedEvent } from '@libs/core/notification/events/notification-campaign-requested.event';
import { NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC } from '@libs/core/notification/events/notification-event-topic.constants';
import { NotificationCoreService } from '@libs/core/notification/notification-core.service';
import { BroadcastNotificationDto } from './dto/request/broadcast-notification.dto';

@Injectable()
export class AdminPushNotificationService {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly pushTokenCoreService: PushTokenCoreService,
    private readonly installationLifecycleCoreService: InstallationLifecycleCoreService,
    private readonly notificationCoreService: NotificationCoreService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  public async sendPushNotification(
    dto: SendPushNotificationDto,
  ): Promise<void> {
    const [pushToken, installation] = await Promise.all([
      this.pushTokenCoreService.getPushTokenByUserIdx(dto.userIdx),
      this.installationLifecycleCoreService.getInstallationIdByUserIdx(
        dto.userIdx,
      ),
    ]);

    if (!pushToken || !installation) {
      throw new NotFoundException(
        `Push token or installation not found for userIdx: ${dto.userIdx}`,
      );
    }

    try {
      await this.pushNotificationService.send({
        token: pushToken.expoPushToken,
        platform: installation.platform as 'ios' | 'android',
        title: dto.title,
        body: dto.body,
        data: dto.data,
      });
    } catch (error) {
      if (error instanceof ApnsDeviceTokenUnregisteredException) {
        await this.pushTokenCoreService.deletePushTokenIfExists(pushToken.id);
      }

      throw error;
    }
  }

  public async broadcastNotification(
    dto: BroadcastNotificationDto,
  ): Promise<void> {
    const notification = await this.notificationCoreService.getNotificationById(
      dto.notificationId,
    );

    if (!notification) {
      throw new NotFoundException(
        `Notification not found: ${dto.notificationId}`,
      );
    }

    const campaign =
      await this.notificationCoreService.createNotificationCampaign(
        notification.id,
      );

    await this.kafkaProducerService.emit<NotificationCampaignRequestedEvent>(
      NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC,
      { campaignId: campaign.id },
    );
  }
}
