import { AdminServerModule } from '@admin/admin-server.module';
import {
  ApnsDeviceTokenUnregisteredException,
  ApnsPushNotificationProvider,
} from '@libs/common/modules/push-notification/provider/apns/apns-push-notification.provider';
import { KafkaProducerService } from '@libs/common/modules/kafka/kafka-producer.service';
import { NotificationPageType } from '@libs/core/notification/constants/notification-page-type.constant';
import { NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC } from '@libs/core/notification/events/notification-event-topic.constants';
import { InstallationSeedHelper } from '@libs/testing/seed/installation/installation.seed';
import { PushTokenSeedHelper } from '@libs/testing/seed/push-token/push-token.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from '../../setup/test.helper';

describe('Push Notification E2E Tests', () => {
  const apnsProvider = {
    send: jest.fn(),
  };
  const kafkaProducerService = {
    emit: jest.fn(),
  };
  const testHelper = TestHelper.create(AdminServerModule);

  testHelper
    .overrideProvider(ApnsPushNotificationProvider)
    .useValue(apnsProvider);
  testHelper
    .overrideProvider(KafkaProducerService)
    .useValue(kafkaProducerService);

  beforeEach(async () => {
    apnsProvider.send.mockReset().mockResolvedValue(undefined);
    kafkaProducerService.emit.mockReset().mockResolvedValue(undefined);
    await testHelper.init();
    testHelper.mockDiscordWebhookSendErrorMessage();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /push-notification/broadcast', () => {
    it('202 - create campaign and emit event for existing notification', async () => {
      const notification = await testHelper.getPrisma().notification.create({
        data: {
          title: '전체 알림 제목',
          content: '전체 알림 내용',
          pageType: NotificationPageType.NOTICE,
        },
      });

      await testHelper
        .test()
        .post('/push-notification/broadcast')
        .set('Cookie', [`token=Bearer ${testHelper.loginAdmin.admin1.token}`])
        .send({ notificationId: notification.id })
        .expect(202);

      const campaign = await testHelper
        .getPrisma()
        .notificationCampaign.findFirstOrThrow({
          where: { notificationId: notification.id },
        });

      expect(campaign).toMatchObject({
        notificationId: notification.id,
        targetCount: 0,
        successCount: 0,
        failCount: 0,
        completedAt: null,
      });
      expect(kafkaProducerService.emit).toHaveBeenCalledTimes(1);
      expect(kafkaProducerService.emit).toHaveBeenCalledWith(
        NOTIFICATION_CAMPAIGN_REQUESTED_TOPIC,
        { campaignId: campaign.id },
      );
    });
  });

  describe('POST /push-notification/send', () => {
    it('201 - send push notification', async () => {
      const { userIdx, installationId, expoPushToken } = await seedPushToken();

      const pushTokenBeforeSend = await testHelper
        .getPrisma()
        .pushToken.findUnique({
          where: { id: installationId },
        });

      expect(pushTokenBeforeSend?.expoPushToken).toBe(expoPushToken);

      await sendPushNotification(userIdx).expect(201);

      expect(apnsProvider.send).toHaveBeenCalledTimes(1);
      expect(apnsProvider.send).toHaveBeenCalledWith(expoPushToken, {
        title: '푸시 알림 테스트',
        body: '푸시 알림 테스트 본문',
      });

      const pushTokenAfterSend = await testHelper
        .getPrisma()
        .pushToken.findUnique({
          where: { id: installationId },
        });

      expect(pushTokenAfterSend?.expoPushToken).toBe(expoPushToken);
    });

    it('410 - delete push token when APNs returns Unregistered', async () => {
      const { userIdx, installationId, expoPushToken } = await seedPushToken();

      const pushTokenBeforeSend = await testHelper
        .getPrisma()
        .pushToken.findUnique({
          where: { id: installationId },
        });

      expect(pushTokenBeforeSend?.expoPushToken).toBe(expoPushToken);

      apnsProvider.send.mockRejectedValueOnce(
        new ApnsDeviceTokenUnregisteredException(
          expoPushToken,
          JSON.stringify({ reason: 'Unregistered' }),
        ),
      );

      await sendPushNotification(userIdx).expect(410);

      const pushTokenAfterSend = await testHelper
        .getPrisma()
        .pushToken.findUnique({
          where: { id: installationId },
        });

      expect(pushTokenAfterSend).toBeNull();
    });
  });

  async function seedPushToken(): Promise<{
    userIdx: number;
    installationId: string;
    expoPushToken: string;
  }> {
    const user = await testHelper.seedHelper(UserSeedHelper).seed({});
    const installation = await testHelper
      .seedHelper(InstallationSeedHelper)
      .seed({ userIdx: user.idx, platform: 'ios' });
    const pushToken = await testHelper.seedHelper(PushTokenSeedHelper).seed({
      id: installation.id,
      expoPushToken: `apns-token-${installation.id}`,
    });

    return {
      userIdx: user.idx,
      installationId: installation.id,
      expoPushToken: pushToken.expoPushToken,
    };
  }

  function sendPushNotification(userIdx: number) {
    return testHelper
      .test()
      .post('/push-notification/send')
      .set('Cookie', [`token=Bearer ${testHelper.loginAdmin.admin1.token}`])
      .send({
        userIdx,
        title: '푸시 알림 테스트',
        body: '푸시 알림 테스트 본문',
      });
  }
});
