import { ITestHelper } from '@libs/testing/interface/test-helper.interface';
import { Type } from '@libs/common/types/Type';
import { ApnsPushNotificationProvider } from '@libs/common/modules/push-notification/provider/apns/apns-push-notification.provider';
import { FcmPushNotificationProvider } from '@libs/common/modules/push-notification/provider/fcm/fcm-push-notification.provider';

export class TestHelper extends ITestHelper {
  /**
   * init 메서드를 사용한 이후부터 사용할 수 있습니다.
   */
  public static create(AppModule: Type) {
    const helper = new TestHelper(AppModule);

    helper.overrideProvider(ApnsPushNotificationProvider).useValue({
      send: jest.fn().mockResolvedValue(undefined),
    });

    helper.overrideProvider(FcmPushNotificationProvider).useValue({
      send: jest.fn().mockResolvedValue(undefined),
    });

    return helper;
  }

  public async appSetup(): Promise<void> {}
}
