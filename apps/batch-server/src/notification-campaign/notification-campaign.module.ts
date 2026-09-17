import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { PushNotificationModule } from '@libs/common/modules/push-notification/push-notification.module';
import { NotificationCoreModule } from '@libs/core/notification/notification-core.module';
import { PushTokenCoreModule } from '@libs/core/push-notification/push-token-core.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import notificationCampaignConfig from './config/notification-campaign.config';
import { NotificationCampaignController } from './notification-campaign.controller';
import { NotificationCampaignService } from './notification-campaign.service';

@Module({
  imports: [
    NotificationCoreModule,
    PushTokenCoreModule,
    PushNotificationModule,
    DiscordWebhookModule,
    ConfigModule.forFeature(notificationCampaignConfig),
  ],
  controllers: [NotificationCampaignController],
  providers: [NotificationCampaignService],
})
export class NotificationCampaignModule {}
