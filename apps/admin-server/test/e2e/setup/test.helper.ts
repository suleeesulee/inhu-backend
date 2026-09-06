import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoginAdminForTest, LoginAdminHelper } from './login-admin.helper';
import { ITestHelper } from '@libs/testing/interface/test-helper.interface';
import { Type } from '@libs/common/types/Type';
import { OpenAIService } from '@libs/common/modules/openAI/openAI.service';
import { ApnsPushNotificationProvider } from '@libs/common/modules/push-notification/provider/apns/apns-push-notification.provider';
import { FcmPushNotificationProvider } from '@libs/common/modules/push-notification/provider/fcm/fcm-push-notification.provider';

export class TestHelper extends ITestHelper {
  /**
   * init 메서드를 사용한 이후부터 사용할 수 있습니다.
   */
  public loginAdmin: {
    admin1: LoginAdminForTest;
    admin2: LoginAdminForTest;
    superAdmin: LoginAdminForTest;
    magazineAdmin1: LoginAdminForTest;
    magazineAdmin2: LoginAdminForTest;
    allAdmin1: LoginAdminForTest;
  };

  public static create(AppModule: Type) {
    const helper = new TestHelper(AppModule);

    helper.overrideProvider(OpenAIService).useValue({
      complete: jest.fn().mockResolvedValue({ stations: [] }),
      completeWithImage: jest.fn().mockResolvedValue({ stations: [] }),
    });

    helper.overrideProvider(ApnsPushNotificationProvider).useValue({
      send: jest.fn().mockResolvedValue(undefined),
    });

    helper.overrideProvider(FcmPushNotificationProvider).useValue({
      send: jest.fn().mockResolvedValue(undefined),
    });

    return helper;
  }

  public async appSetup(): Promise<void> {
    this.app.use(cookieParser());
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    this.loginAdmin = await LoginAdminHelper.create(this);
  }
}
