import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { NoticeSeedHelper } from '@libs/testing/seed/notice/notice.seed';
import { NoticeEntity } from '@admin/api/notice/entity/notice.entity';
import { NoticeOverviewEntity } from '@admin/api/notice/entity/notice-overview.entity';
import { CreateNoticeDto } from '@admin/api/notice/dto/request/create-notice.dto';
import { UpdateNoticeByIdxDto } from '@admin/api/notice/dto/request/update-notice-by-idx.dto';

describe('Notice e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const noticeSeedHelper = testHelper.seedHelper(NoticeSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /notice/all', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: admin.idx,
        title: 'Test Notice Title',
        content: 'Test Notice Content',
      });

      const response = await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const noticeList: NoticeOverviewEntity[] = response.body.noticeList;
      const count: number = response.body.count;

      expect(Array.isArray(noticeList)).toBe(true);
      expect(noticeList.length).toBe(1);
      expect(count).toBe(1);

      const notice: NoticeOverviewEntity = noticeList[0];

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.createdAt).toBeDefined();
      expect(notice.author).toBeDefined();
      expect(notice.author.idx).toBe(admin.idx);
      expect(notice.author.nickname).toBe(admin.nickname);
    });

    it('200 - returns empty list when no notices', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.noticeList).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('200 - pagination check (page too high returns empty)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await noticeSeedHelper.seedAll([
        { authorIdx: admin.idx },
        { authorIdx: admin.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(response.body.noticeList).toEqual([]);
      expect(response.body.count).toBe(2);
    });

    it('200 - returns latest notice first (desc by createdAt)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const [notice1, notice2] = await noticeSeedHelper.seedAll([
        { authorIdx: admin.idx },
        { authorIdx: admin.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const noticeList: NoticeOverviewEntity[] = response.body.noticeList;

      expect(noticeList[0].idx).toBe(notice2.idx);
      expect(noticeList[1].idx).toBe(notice1.idx);
    });

    it('401 - no access token', async () => {
      await testHelper
        .test()
        .get('/notice/all')
        .query({ page: 1 })
        .expect(401);
    });

    it('403 - insufficient role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });

    it('400 - missing page param', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/notice/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });
  });

  describe('GET /notice/:idx', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: admin.idx,
        title: 'Detail Notice Title',
        content: 'Detail Notice Content',
      });

      const response = await testHelper
        .test()
        .get(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const notice: NoticeEntity = response.body;

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.content).toBe(noticeSeed.content);
      expect(notice.createdAt).toBeDefined();
      expect(notice.author).toBeDefined();
      expect(notice.author.idx).toBe(admin.idx);
      expect(notice.author.nickname).toBe(admin.nickname);
    });

    it('404 - notice not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/notice/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('401 - no access token', async () => {
      await testHelper.test().get('/notice/1').expect(401);
    });

    it('403 - insufficient role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/notice/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('400 - invalid idx (non-integer)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/notice/abc')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });
  });

  describe('POST /notice', () => {
    it('201 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const dto: CreateNoticeDto = {
        title: 'New Notice Title',
        content: 'New Notice Content',
      };

      const response = await testHelper
        .test()
        .post('/notice')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(dto)
        .expect(201);

      const notice: NoticeEntity = response.body;

      expect(notice.idx).toBeDefined();
      expect(notice.title).toBe(dto.title);
      expect(notice.content).toBe(dto.content);
      expect(notice.createdAt).toBeDefined();
      expect(notice.author).toBeDefined();
      expect(notice.author.idx).toBe(admin.idx);
      expect(notice.author.nickname).toBe(admin.nickname);
    });

    it('401 - no access token', async () => {
      const dto: CreateNoticeDto = {
        title: 'New Notice',
        content: 'New Content',
      };

      await testHelper.test().post('/notice').send(dto).expect(401);
    });

    it('403 - insufficient role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const dto: CreateNoticeDto = {
        title: 'New Notice',
        content: 'New Content',
      };

      await testHelper
        .test()
        .post('/notice')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(dto)
        .expect(403);
    });

    it('400 - missing title', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/notice')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ content: 'Content only' })
        .expect(400);
    });

    it('400 - missing content', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/notice')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ title: 'Title only' })
        .expect(400);
    });
  });

  describe('PUT /notice/:idx', () => {
    it('200 - update title and content', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: admin.idx,
        title: 'Original Title',
        content: 'Original Content',
      });

      const dto: UpdateNoticeByIdxDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      await testHelper
        .test()
        .put(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(dto)
        .expect(200);

      const response = await testHelper
        .test()
        .get(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const notice: NoticeEntity = response.body;

      expect(notice.title).toBe(dto.title);
      expect(notice.content).toBe(dto.content);
    });

    it('200 - partial update (title only)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: admin.idx,
        title: 'Original Title',
        content: 'Original Content',
      });

      const dto: UpdateNoticeByIdxDto = {
        title: 'Updated Title Only',
      };

      await testHelper
        .test()
        .put(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(dto)
        .expect(200);

      const response = await testHelper
        .test()
        .get(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const notice: NoticeEntity = response.body;

      expect(notice.title).toBe(dto.title);
      expect(notice.content).toBe(noticeSeed.content);
    });

    it('404 - notice not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/notice/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('401 - no access token', async () => {
      await testHelper
        .test()
        .put('/notice/1')
        .send({ title: 'Updated' })
        .expect(401);
    });

    it('403 - insufficient role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/notice/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ title: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /notice/:idx', () => {
    it('200 - successfully deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const noticeSeed = await noticeSeedHelper.seed({
        authorIdx: admin.idx,
      });

      await testHelper
        .test()
        .delete(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      await testHelper
        .test()
        .get(`/notice/${noticeSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - notice not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/notice/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('401 - no access token', async () => {
      await testHelper.test().delete('/notice/1').expect(401);
    });

    it('403 - insufficient role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .delete('/notice/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('400 - invalid idx (non-integer)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/notice/abc')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });
  });
});
