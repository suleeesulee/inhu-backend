import { PushNotificationService } from '@libs/common/modules/push-notification/push-notification.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SendPushNotificationDto } from './dto/request/send-push-notification.dto';
import { PushTokenCoreService } from '@libs/core/push-notification/push-token-core.service';
import { InstallationLifecycleCoreService } from '@libs/core/installation-lifecycle/installation-lifecycle-core.service';

@Injectable()
export class AdminPushNotificationService {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
    private readonly pushTokenCoreService: PushTokenCoreService,
    private readonly installationLifecycleCoreService: InstallationLifecycleCoreService,
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

    await this.pushNotificationService.send({
      token: pushToken.expoPushToken,
      platform: installation.platform as 'ios' | 'android',
      title: dto.title,
      body: dto.body,
      data: dto.data,
    });
  }
}
