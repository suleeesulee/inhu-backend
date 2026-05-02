import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { DailyMemoSeedHelper } from '@libs/testing/seed/daily-memo/daily-memo.seed';
import { GetDailyMemoAllDto } from '@admin/api/daily-memo/dto/request/get-daily-memo-all.dto';
import { DailyMemoCoreService } from '@libs/core/daily-memo/daily-memo-core.service';

describe('Cafeteria e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const cafeteriaSeedHelper = testHelper.seedHelper(CafeteriaSeedHelper);
  const dailyMemoSeedHelper = testHelper.seedHelper(DailyMemoSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /cafeteria/:idx/daily-memo/all', () => {
    it('field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
      expect(response.body[0].content).toBe(dailyMemo.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo.date);
    });

    it('200 - get empty list', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body).toStrictEqual([]);
    });

    it('200 - memo date is equal to startDate', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
    });

    it('200 - memo date is equal to endDate', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-26'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
    });

    it('200 - memo date is between startDate and endDate', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-23'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
    });

    it('200 - get multiple daily memos', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo1 = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo 1',
        date: new Date('2026-04-20'),
      });
      const dailyMemo2 = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo 2',
        date: new Date('2026-04-21'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].idx).toBe(dailyMemo1.idx);
      expect(response.body[0].content).toBe(dailyMemo1.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo1.date);
      expect(response.body[1].idx).toBe(dailyMemo2.idx);
      expect(response.body[1].content).toBe(dailyMemo2.content);
      expect(new Date(response.body[1].date)).toStrictEqual(dailyMemo2.date);
    });

    it('200 - only get daily memo of the specified cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria1 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 1',
      });
      const cafeteria2 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 2',
      });

      const [dailyMemo1, dailyMemo2] = await dailyMemoSeedHelper.seedAll([
        {
          cafeteriaIdx: cafeteria1.idx,
          content: 'test daily memo 1',
          date: new Date('2026-04-20'),
        },
        {
          cafeteriaIdx: cafeteria2.idx,
          content: 'test daily memo 2',
          date: new Date('2026-04-20'),
        },
      ]);

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria1.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].idx).toBe(dailyMemo1.idx);
      expect(response.body[0].content).toBe(dailyMemo1.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo1.date);
    });

    it('200 - only get multiple daily memos of the specified cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria1 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 1',
      });
      const cafeteria2 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 2',
      });

      const [dailyMemo1, dailyMemo2, dailyMemo3] =
        await dailyMemoSeedHelper.seedAll([
          {
            cafeteriaIdx: cafeteria1.idx,
            content: 'test daily memo 1',
            date: new Date('2026-04-20'),
          },
          {
            cafeteriaIdx: cafeteria1.idx,
            content: 'test daily memo 2',
            date: new Date('2026-04-21'),
          },
          {
            cafeteriaIdx: cafeteria2.idx,
            content: 'test daily memo 3',
            date: new Date('2026-04-20'),
          },
        ]);

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria1.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].idx).toBe(dailyMemo1.idx);
      expect(response.body[0].content).toBe(dailyMemo1.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo1.date);
      expect(response.body[1].idx).toBe(dailyMemo2.idx);
      expect(response.body[1].content).toBe(dailyMemo2.content);
      expect(new Date(response.body[1].date)).toStrictEqual(dailyMemo2.date);
    });

    it('200 - successfully get daily memo (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
      expect(response.body[0].content).toBe(dailyMemo.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo.date);
    });

    it('200 - successfully get daily memo (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(200);

      expect(response.body[0].idx).toBe(dailyMemo.idx);
      expect(response.body[0].content).toBe(dailyMemo.content);
      expect(new Date(response.body[0].date)).toStrictEqual(dailyMemo.date);
    });

    it('400 - invalid cafeteria idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };
      const invalidCafeteriaIdx = 'invalid';

      await testHelper
        .test()
        .get(`/cafeteria/${invalidCafeteriaIdx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(400);
    });

    it('400 - invalid startDate format', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto = {
        startDate: 'invalid-date',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(400);
    });

    it('400 - invalid endDate format', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: 'invalid-date',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(400);
    });

    it('401 - token is not provided', async () => {
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .query(getDailyMemoAllDto)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .query(getDailyMemoAllDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/daily-memo/all`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query(getDailyMemoAllDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const getDailyMemoAllDto: GetDailyMemoAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/99999/daily-memo/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getDailyMemoAllDto)
        .expect(404);
    });
  });

  describe('POST /cafeteria/:idx/daily-memo', () => {
    it('successfully create daily memo', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDailyMemoDto)
        .expect(201);

      expect(response.body.content).toBe(createDailyMemoDto.content);
      expect(new Date(response.body.date)).toStrictEqual(
        new Date(createDailyMemoDto.date),
      );
    });

    it('200 - successfully create daily memo (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createDailyMemoDto)
        .expect(201);

      expect(response.body.content).toBe(createDailyMemoDto.content);
      expect(new Date(response.body.date)).toStrictEqual(
        new Date(createDailyMemoDto.date),
      );
    });

    it('200 - successfully create daily memo (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDailyMemoDto)
        .expect(201);

      expect(response.body.content).toBe(createDailyMemoDto.content);
      expect(new Date(response.body.date)).toStrictEqual(
        new Date(createDailyMemoDto.date),
      );
    });

    it('400 - invalid cafeteria idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };
      const invalidCafeteriaIdx = 'invalid';

      await testHelper
        .test()
        .post(`/cafeteria/${invalidCafeteriaIdx}/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDailyMemoDto)
        .expect(400);
    });

    it('400 - invalid body', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const invalidCreateDailyMemoDto = {
        content: 'test daily memo',
        date: 'invalid-date',
      };

      await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidCreateDailyMemoDto)
        .expect(400);
    });

    it('401 - token is not provided', async () => {
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .send(createDailyMemoDto)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(createDailyMemoDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(createDailyMemoDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDailyMemoDto = {
        content: 'test daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .post(`/cafeteria/99999/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDailyMemoDto)
        .expect(404);
    });

    it('409 - daily memo for the date already exists', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const createDailyMemoDto = {
        content: 'test daily memo 2',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/daily-memo`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDailyMemoDto)
        .expect(409);
    });
  });

  describe('PUT /daily-memo/:idx', () => {
    it('successfully update daily memo', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDailyMemoDto)
        .expect(200);

      const updatedDailyMemo = await testHelper
        .get(DailyMemoCoreService)
        .getDailyMemoByIdx(dailyMemo.idx);

      if (!updatedDailyMemo) {
        throw new Error('Updated daily memo not found');
      }

      expect(updatedDailyMemo).not.toBeNull();
      expect(updatedDailyMemo.content).toBe(updateDailyMemoDto.content);
      expect(new Date(updatedDailyMemo.date)).toStrictEqual(
        new Date(updateDailyMemoDto.date),
      );
    });

    it('200 - successfully update daily memo (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(updateDailyMemoDto)
        .expect(200);

      const updatedDailyMemo = await testHelper
        .get(DailyMemoCoreService)
        .getDailyMemoByIdx(dailyMemo.idx);

      if (!updatedDailyMemo) {
        throw new Error('Updated daily memo not found');
      }

      expect(updatedDailyMemo).not.toBeNull();
      expect(updatedDailyMemo.content).toBe(updateDailyMemoDto.content);
      expect(new Date(updatedDailyMemo.date)).toStrictEqual(
        new Date(updateDailyMemoDto.date),
      );
    });

    it('200 - successfully update daily memo (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDailyMemoDto)
        .expect(200);

      const updatedDailyMemo = await testHelper
        .get(DailyMemoCoreService)
        .getDailyMemoByIdx(dailyMemo.idx);

      if (!updatedDailyMemo) {
        throw new Error('Updated daily memo not found');
      }

      expect(updatedDailyMemo).not.toBeNull();
      expect(updatedDailyMemo.content).toBe(updateDailyMemoDto.content);
      expect(new Date(updatedDailyMemo.date)).toStrictEqual(
        new Date(updateDailyMemoDto.date),
      );
    });

    it('400 - invalid daily memo idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };
      const invalidDailyMemoIdx = 'invalid';

      await testHelper
        .test()
        .put(`/daily-memo/${invalidDailyMemoIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDailyMemoDto)
        .expect(400);
    });

    it('400 - invalid body', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const invalidUpdateDailyMemoDto = {
        content: 'updated daily memo',
        date: 'invalid-date',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidUpdateDailyMemoDto)
        .expect(400);
    });

    it('401 - token is not provided', async () => {
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .send(updateDailyMemoDto)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(updateDailyMemoDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(updateDailyMemoDto)
        .expect(403);
    });

    it('404 - daily memo not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateDailyMemoDto = {
        content: 'updated daily memo',
        date: '2026-04-20',
      };

      await testHelper
        .test()
        .put(`/daily-memo/99999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDailyMemoDto)
        .expect(404);
    });
  });

  describe('DELETE /daily-memo/:idx', () => {
    it('successfully delete daily memo', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedDailyMemo = await prisma.dailyMemo.findFirstOrThrow({
        where: { idx: dailyMemo.idx },
      });

      expect(deletedDailyMemo.idx).toBe(dailyMemo.idx);
      expect(deletedDailyMemo.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete daily memo (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedDailyMemo = await prisma.dailyMemo.findFirstOrThrow({
        where: { idx: dailyMemo.idx },
      });

      expect(deletedDailyMemo.idx).toBe(dailyMemo.idx);
      expect(deletedDailyMemo.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete daily memo (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedDailyMemo = await prisma.dailyMemo.findFirstOrThrow({
        where: { idx: dailyMemo.idx },
      });

      expect(deletedDailyMemo.idx).toBe(dailyMemo.idx);
      expect(deletedDailyMemo.deletedAt).not.toBeNull();
    });

    it('400 - invalid daily memo idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const invalidDailyMemoIdx = 'invalid';

      await testHelper
        .test()
        .delete(`/daily-memo/${invalidDailyMemoIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - token is not provided', async () => {
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const dailyMemo = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      await testHelper
        .test()
        .delete(`/daily-memo/${dailyMemo.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - daily memo not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/daily-memo/99999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
