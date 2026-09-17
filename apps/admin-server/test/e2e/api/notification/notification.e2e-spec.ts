import { AdminServerModule } from '@admin/admin-server.module';
import { NotificationPageType } from '@libs/core/notification/constants/notification-page-type.constant';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { TestHelper } from '../../setup/test.helper';

describe('Notification E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /notification/all', () => {
    it('200 - get all notifications in latest order with pagination', async () => {
      await testHelper.getPrisma().notification.createMany({
        data: Array.from({ length: 11 }, (_, index) => ({
          title: `알림 ${index}`,
          content: `알림 내용 ${index}`,
          pageType: NotificationPageType.NOTICE,
          createdAt: new Date(Date.UTC(2026, 0, index + 1)),
        })),
      });

      const user = await testHelper.seedHelper(UserSeedHelper).seed({});
      const privateNotification = await testHelper
        .getPrisma()
        .notification.findFirstOrThrow({
          where: { title: '알림 10' },
        });

      await testHelper.getPrisma().loginUserNotification.create({
        data: {
          notificationId: privateNotification.id,
          userIdx: user.idx,
        },
      });

      const response = await testHelper
        .test()
        .get('/notification/all')
        .query({ page: 1 })
        .set('Cookie', [`token=Bearer ${testHelper.loginAdmin.admin1.token}`])
        .expect(200);

      expect(response.body.count).toBe(11);
      expect(response.body.notificationList).toHaveLength(10);
      expect(
        response.body.notificationList.map(
          (notification: { title: string }) => notification.title,
        ),
      ).toEqual([
        '알림 10',
        '알림 9',
        '알림 8',
        '알림 7',
        '알림 6',
        '알림 5',
        '알림 4',
        '알림 3',
        '알림 2',
        '알림 1',
      ]);
    });
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
