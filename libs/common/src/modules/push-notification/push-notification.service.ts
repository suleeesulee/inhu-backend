import { Injectable } from '@nestjs/common';
import { SendPushNotificationInput } from '@libs/common/modules/push-notification/input/send-push-notification.input';
import { ApnsPushNotificationProvider } from '@libs/common/modules/push-notification/provider/apns/apns-push-notification.provider';

/**
 * 플랫폼에 맞는 푸시 알림 프로바이더로 발송을 위임하는 서비스
 *
 * @publicApi
 */
@Injectable()
export class PushNotificationService {
  constructor(
    private readonly apnsProvider: ApnsPushNotificationProvider,
  ) {}

  public async send(input: SendPushNotificationInput): Promise<void> {
    const payload = {
      title: input.title,
      body: input.body,
      data: input.data,
    };

    if (input.platform === 'ios') {
      await this.apnsProvider.send(input.token, payload);
      return;
    }

    // Android: FcmPushNotificationProvider 추가 후 여기서 위임
  }
}
