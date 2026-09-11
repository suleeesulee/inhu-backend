import { PushNotificationService } from '@libs/common/modules/push-notification/push-notification.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SendPushNotificationDto } from './dto/request/send-push-notification.dto';
import { PushTokenCoreService } from '@libs/core/push-notification/push-token-core.service';

@Injectable()
export class AdminPushNotificationService {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly pushTokenCoreService: PushTokenCoreService,
  ) {}

  public async sendPushNotification(
    dto: SendPushNotificationDto,
  ): Promise<void> {
    const pushToken = await this.pushTokenCoreService.getPushTokenByUserIdx(
      dto.userIdx,
    );
    if (!pushToken) {
      throw new NotFoundException(
        `Push token not found for userIdx: ${dto.userIdx}`,
      );
    }

    await this.pushNotificationService.send({
      token: pushToken.expoPushToken,
      platform: dto.platform,
      title: dto.title,
      body: dto.body,
      data: dto.data,
    });
  }
}
