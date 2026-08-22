import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { NoticeSeedHelper } from '@libs/testing/seed/notice/notice.seed';
import { NoticeEntity } from '@user/api/notice/entity/notice.entity';
import { NoticeOverviewEntity } from '@user/api/notice/entity/notice-overview.entity';

describe('Notice E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const noticeSeedHelper = testHelper.seedHelper(NoticeSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /notice/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Test Notice Title',
        content: 'Test Notice Content',
      });

      const response = await testHelper
        .test()
        .get('/notice/all')
        .query({ page: 1 })
        .expect(200);

      const noticeList: NoticeOverviewEntity[] = response.body.noticeList;
      const hasNext: boolean = response.body.hasNext;

      expect(Array.isArray(noticeList)).toBe(true);
      expect(noticeList.length).toBe(1);
      expect(hasNext).toBe(false);

      const notice: NoticeOverviewEntity = noticeList[0];

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.createdAt).toBeDefined();
      expect((notice as any).author).toBeUndefined();
      expect((notice as any).content).toBeUndefined();
    });

    it('200 - returns empty list when no notices', async () => {
      const response = await testHelper
        .test()
        .get('/notice/all')
        .query({ page: 1 })
        .expect(200);

      expect(response.body.noticeList).toEqual([]);
      expect(response.body.hasNext).toBe(false);
    });

    it('200 - pagination check (page too high returns empty)', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await noticeSeedHelper.seedAll([
        { authorIdx: loginUser.idx },
        { authorIdx: loginUser.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/notice/all')
        .query({ page: 2 })
        .expect(200);

      expect(response.body.noticeList).toEqual([]);
      expect(response.body.hasNext).toBe(false);
    });

    it('200 - returns latest notice first (desc by createdAt)', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const [notice1, notice2] = await noticeSeedHelper.seedAll([
        { authorIdx: loginUser.idx },
        { authorIdx: loginUser.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/notice/all')
        .query({ page: 1 })
        .expect(200);

      const noticeList: NoticeOverviewEntity[] = response.body.noticeList;

      expect(noticeList[0].idx).toBe(notice2.idx);
      expect(noticeList[1].idx).toBe(notice1.idx);
    });

    it('400 - missing page param', async () => {
      await testHelper.test().get('/notice/all').expect(400);
    });
  });

  describe('GET /notice/:idx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Detail Notice Title',
        content: 'Detail Notice Content',
      });

      const response = await testHelper
        .test()
        .get(`/notice/${noticeSeed.idx}`)
        .expect(200);

      const notice: NoticeEntity = response.body;

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.content).toBe(noticeSeed.content);
      expect(notice.createdAt).toBeDefined();
      expect((notice as any).author).toBeUndefined();
    });

    it('404 - notice not found', async () => {
      await testHelper.test().get('/notice/999999').expect(404);
    });

    it('400 - invalid idx (non-integer)', async () => {
      await testHelper.test().get('/notice/abc').expect(400);
    });
  });
});
