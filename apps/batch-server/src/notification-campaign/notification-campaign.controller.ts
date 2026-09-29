import { NotificationCampaignRequestedEvent } from '@libs/core/notification/events/notification-campaign-requested.event';
import { NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC } from '@libs/core/notification/events/notification-event-topic.constants';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationCampaignService } from './notification-campaign.service';

@Controller()
export class NotificationCampaignController {
  constructor(
    private readonly notificationCampaignService: NotificationCampaignService,
  ) {}

  @MessagePattern(NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC)
  public async notificationCampaignRequested(
    @Payload() event: NotificationCampaignRequestedEvent,
  ): Promise<void> {
    await this.notificationCampaignService.sendNotificationCampaignById(
      event.campaignId,
    );
  }
}
