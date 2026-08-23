import { AdminServerModule } from '@admin/admin-server.module';
import { RewardEntity } from '@admin/api/reward/entity/reward.entity';
import { RewardSeedHelper } from '@libs/testing/seed/reward/reward.seed';
import { TestHelper } from '../../setup/test.helper';

describe('Reward E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const rewardSeedHelper = testHelper.seedHelper(RewardSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /reward/all', () => {
    it('200 - field check without activated filter', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [activatedReward, deactivatedReward] =
        await rewardSeedHelper.seedAll([
          {
            name: '활성화된 스타벅스 아메리카노',
            imagePath: '/reward/starbucks-americano.png',
            activatedAt: new Date(),
          },
          {
            name: '비활성화된 배민 상품권',
            imagePath: null,
            activatedAt: null,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const rewardList: RewardEntity[] = response.body.rewardList;

      expect(response.body.count).toBe(2);
      expect(rewardList).toHaveLength(2);
      expect(rewardList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            idx: activatedReward.idx,
            name: activatedReward.name,
            imagePath: activatedReward.imagePath,
          }),
          expect.objectContaining({
            idx: deactivatedReward.idx,
            name: deactivatedReward.name,
            imagePath: deactivatedReward.imagePath,
            activatedAt: null,
          }),
        ]),
      );
      expect(rewardList[0].createdAt).toBeDefined();
    });

    it('200 - activated filter check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [activatedReward, deactivatedReward] =
        await rewardSeedHelper.seedAll([
          { name: '활성화 필터 대상', activatedAt: new Date() },
          { name: '비활성화 필터 대상', activatedAt: null },
        ]);

      const activatedResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: true })
        .expect(200);
      const deactivatedResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: false })
        .expect(200);

      expect(activatedResponse.body.rewardList).toHaveLength(1);
      expect(activatedResponse.body.rewardList[0].idx).toBe(
        activatedReward.idx,
      );
      expect(deactivatedResponse.body.rewardList).toHaveLength(1);
      expect(deactivatedResponse.body.rewardList[0].idx).toBe(
        deactivatedReward.idx,
      );
    });

    it('200 - deleted reward is excluded', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [visibleReward, deletedReward] = await rewardSeedHelper.seedAll([
        { name: '조회 가능한 리워드', activatedAt: new Date() },
        {
          name: '삭제된 리워드',
          activatedAt: new Date(),
          deletedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const rewardIdxList: number[] = response.body.rewardList.map(
        (reward: RewardEntity) => reward.idx,
      );

      expect(rewardIdxList).toContain(visibleReward.idx);
      expect(rewardIdxList).not.toContain(deletedReward.idx);
    });

    it('200 - pagination check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      await rewardSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          name: `페이지 리워드 ${index + 1}`,
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.count).toBe(11);
      expect(firstPageResponse.body.rewardList).toHaveLength(10);
      expect(secondPageResponse.body.count).toBe(11);
      expect(secondPageResponse.body.rewardList).toHaveLength(1);
    });

    it('200 - order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [olderReward, newerReward] = await rewardSeedHelper.seedAll([
        { name: '오래된 리워드' },
        { name: '최근 리워드' },
      ]);
      await testHelper.getPrisma().reward.update({
        where: { idx: olderReward.idx },
        data: { createdAt: new Date('2026-01-01T00:00:00.000Z') },
      });
      await testHelper.getPrisma().reward.update({
        where: { idx: newerReward.idx },
        data: { createdAt: new Date('2026-01-02T00:00:00.000Z') },
      });

      const ascendingResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'asc' })
        .expect(200);
      const descendingResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'desc' })
        .expect(200);

      expect(ascendingResponse.body.rewardList[0].idx).toBe(olderReward.idx);
      expect(descendingResponse.body.rewardList[0].idx).toBe(newerReward.idx);
    });

    it('200 - returns empty list when rewards do not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.rewardList).toEqual([]);
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'invalid-order' })
        .expect(400);
    });

    it('400 - activated is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: 'invalid-activated' })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/reward/all').query({ page: 1 }).expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });
  });

  describe('GET /reward/:idx', () => {
    it('200 - inactive reward field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        name: '상세 조회 리워드',
        imagePath: '/reward/detail.png',
        activatedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const reward: RewardEntity = response.body;

      expect(reward.idx).toBe(rewardSeed.idx);
      expect(reward.name).toBe(rewardSeed.name);
      expect(reward.imagePath).toBe(rewardSeed.imagePath);
      expect(reward.activatedAt).toBeNull();
      expect(reward.createdAt).toBeDefined();
    });

    it('400 - reward idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/reward/invalid-reward-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/reward/1').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/reward/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/reward/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - reward has been deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({ deletedAt: new Date() });

      await testHelper
        .test()
        .get(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  describe('POST /reward', () => {
    it('201 - creates inactive reward without image path', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .post('/reward')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '이미지 없는 신규 리워드' })
        .expect(201);

      const reward: RewardEntity = response.body;

      expect(reward.idx).toBeDefined();
      expect(reward.name).toBe('이미지 없는 신규 리워드');
      expect(reward.imagePath).toBeNull();
      expect(reward.activatedAt).toBeNull();
      expect(reward.createdAt).toBeDefined();
    });

    it('201 - creates inactive reward with image path', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const imagePath = '/reward/new-reward.png';

      const response = await testHelper
        .test()
        .post('/reward')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '이미지 있는 신규 리워드', imagePath })
        .expect(201);

      expect(response.body.name).toBe('이미지 있는 신규 리워드');
      expect(response.body.imagePath).toBe(imagePath);
      expect(response.body.activatedAt).toBeNull();
    });

    it('400 - reward name is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({})
        .expect(400);
    });

    it('400 - reward image path is not string', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '잘못된 이미지 리워드', imagePath: 1 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post('/reward')
        .send({ name: '인증 없는 리워드' })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/reward')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ name: '권한 없는 리워드' })
        .expect(403);
    });
  });

  describe('PUT /reward/:idx', () => {
    it('200 - updates name and image path', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        name: '수정 전 리워드',
        imagePath: '/reward/before.png',
      });

      await testHelper
        .test()
        .put(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '수정 후 리워드', imagePath: '/reward/after.png' })
        .expect(200);

      const reward = await testHelper.getPrisma().reward.findUniqueOrThrow({
        where: { idx: rewardSeed.idx },
      });

      expect(reward.name).toBe('수정 후 리워드');
      expect(reward.imagePath).toBe('/reward/after.png');
      expect(reward.activatedAt).toBeNull();
    });

    it('200 - keeps image path when it is omitted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        name: '이미지 유지 리워드',
        imagePath: '/reward/keep.png',
      });

      await testHelper
        .test()
        .put(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '이름만 수정된 리워드' })
        .expect(200);

      const reward = await testHelper.getPrisma().reward.findUniqueOrThrow({
        where: { idx: rewardSeed.idx },
      });

      expect(reward.name).toBe('이름만 수정된 리워드');
      expect(reward.imagePath).toBe('/reward/keep.png');
    });

    it('400 - reward idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/reward/invalid-reward-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '수정 리워드' })
        .expect(400);
    });

    it('400 - reward name is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/reward/1')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({})
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put('/reward/1')
        .send({ name: '인증 없는 수정' })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/reward/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ name: '권한 없는 수정' })
        .expect(403);
    });

    it('404 - reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/reward/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ name: '없는 리워드 수정' })
        .expect(404);
    });
  });

  describe('POST /reward/:idx/activate', () => {
    it('201 - activates inactive reward', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({ activatedAt: null });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .post(`/reward/${rewardSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(201);

      const reward = await testHelper.getPrisma().reward.findUniqueOrThrow({
        where: { idx: rewardSeed.idx },
      });

      expect(reward.activatedAt).not.toBeNull();
      expect(reward.activatedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
    });

    it('400 - reward idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward/invalid-reward-idx/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/reward/1/activate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/reward/1/activate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward/999999/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - reward has already been activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/reward/${rewardSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });

  describe('POST /reward/:idx/deactivate', () => {
    it('201 - deactivates active reward', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/reward/${rewardSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(201);

      const reward = await testHelper.getPrisma().reward.findUniqueOrThrow({
        where: { idx: rewardSeed.idx },
      });

      expect(reward.activatedAt).toBeNull();
    });

    it('400 - reward idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward/invalid-reward-idx/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/reward/1/deactivate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/reward/1/deactivate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/reward/999999/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - reward is not activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({ activatedAt: null });

      await testHelper
        .test()
        .post(`/reward/${rewardSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });

  describe('DELETE /reward/:idx', () => {
    it('200 - soft deletes reward and excludes it from queries', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const rewardSeed = await rewardSeedHelper.seed({
        name: '삭제 대상 리워드',
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const reward = await testHelper.getPrisma().reward.findUniqueOrThrow({
        where: { idx: rewardSeed.idx },
      });
      const rewardListResponse = await testHelper
        .test()
        .get('/reward/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(reward.deletedAt).not.toBeNull();
      expect(rewardListResponse.body.rewardList).toEqual([]);

      await testHelper
        .test()
        .get(`/reward/${rewardSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('400 - reward idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/reward/invalid-reward-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().delete('/reward/1').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .delete('/reward/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - reward does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/reward/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
