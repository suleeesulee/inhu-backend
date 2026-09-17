import { AdminServerModule } from '@admin/admin-server.module';
import { NotificationPageType } from '@libs/core/notification/constants/notification-page-type.constant';
import { TestHelper } from '../../setup/test.helper';

describe('Notification E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /notification', () => {
    it('201 - create notification without campaign', async () => {
      const response = await testHelper
        .test()
        .post('/notification')
        .set('Cookie', [`token=Bearer ${testHelper.loginAdmin.admin1.token}`])
        .send({
          title: '전체 알림 제목',
          content: '전체 알림 내용',
          pageType: NotificationPageType.NOTICE,
        })
        .expect(201);

      const notification = await testHelper
        .getPrisma()
        .notification.findUnique({
          where: { id: response.body.id },
        });
      const campaignCount = await testHelper
        .getPrisma()
        .notificationCampaign.count({
          where: { notificationId: response.body.id },
        });

      expect(notification).toMatchObject({
        title: '전체 알림 제목',
        content: '전체 알림 내용',
        pageType: NotificationPageType.NOTICE,
      });
      expect(campaignCount).toBe(0);
    });
  });
});
