import { DiscordWebhookContext } from '@libs/common/modules/discord-webhook/constants/discord-webhook-context.enum';
import { DiscordWebhookService } from '@libs/common/modules/discord-webhook/discord-webhook.service';
import { PushNotificationService } from '@libs/common/modules/push-notification/push-notification.service';
import { NotificationCampaignModel } from '@libs/core/notification/model/notification-campaign.model';
import { NotificationCoreService } from '@libs/core/notification/notification-core.service';
import { PushTokenCoreService } from '@libs/core/push-notification/push-token-core.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationCampaignService {
  private readonly pushTokenBatchSize: number;

  constructor(
    private readonly notificationCoreService: NotificationCoreService,
    private readonly pushTokenCoreService: PushTokenCoreService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly discordWebhookService: DiscordWebhookService,
    configService: ConfigService,
  ) {
    this.pushTokenBatchSize = configService.get<number>(
      'notificationCampaign.pushTokenBatchSize',
    )!;
  }

  public async sendNotificationCampaignById(campaignId: string): Promise<void> {
    try {
      const campaign =
        await this.notificationCoreService.getNotificationCampaignById(
          campaignId,
        );

      if (!campaign || campaign.completedAt) {
        return;
      }

      const completedCampaign = await this.sendAll(campaign);
      await this.sendCompletionMessage(completedCampaign);
    } catch (error) {
      await this.discordWebhookService.alertError(
        '알림 캠페인 발송 실패',
        `campaignId: ${campaignId}`,
        error instanceof Error ? error : new Error(String(error)),
        DiscordWebhookContext.BATCH_SERVER,
      );
    }
  }

  private async sendAll(
    campaign: NotificationCampaignModel,
  ): Promise<NotificationCampaignModel> {
    let cursorId: string | undefined;
    let targetCount = campaign.targetCount;

    while (true) {
      const pushTokenList = await this.pushTokenCoreService.getPushTokenAll({
        take: this.pushTokenBatchSize,
        cursorId,
      });

      if (pushTokenList.length === 0) {
        break;
      }

      targetCount += pushTokenList.length;
      await this.notificationCoreService.updateNotificationCampaignById(
        campaign.id,
        { targetCount },
      );

      const resultList = await Promise.allSettled(
        pushTokenList.map((pushToken) =>
          this.pushNotificationService.send({
            token: pushToken.expoPushToken,
            platform: pushToken.platform,
            title: campaign.notification.title,
            body: campaign.notification.content,
          }),
        ),
      );

      const successCount = resultList.filter(
        (result) => result.status === 'fulfilled',
      ).length;
      const failCount = resultList.length - successCount;

      await this.notificationCoreService.updateNotificationCampaignById(
        campaign.id,
        {
          successCount: { increment: successCount },
          failCount: { increment: failCount },
        },
      );

      cursorId = pushTokenList[pushTokenList.length - 1].id;
    }

    return await this.notificationCoreService.updateNotificationCampaignById(
      campaign.id,
      { completedAt: new Date() },
    );
  }

  private async sendCompletionMessage(
    campaign: NotificationCampaignModel,
  ): Promise<void> {
    await this.discordWebhookService.sendWebhookMessage(
      '알림 캠페인 발송 완료',
      [
        `대상: ${campaign.targetCount}개`,
        `성공: ${campaign.successCount}개`,
        `실패: ${campaign.failCount}개`,
      ].join('\n'),
      DiscordWebhookContext.BATCH_SERVER,
    );
  }
}
