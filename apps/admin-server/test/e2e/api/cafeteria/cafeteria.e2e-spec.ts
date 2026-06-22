import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { FoodStationSeedHelper } from '@libs/testing/seed/food-station/food-station.seed';
import { DailyMemoSeedHelper } from '@libs/testing/seed/daily-memo/daily-memo.seed';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';
import { MealType } from '@libs/core/food-station/constants/meal-type.constant';

describe('Cafeteria e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const cafeteriaSeedHelper = testHelper.seedHelper(CafeteriaSeedHelper);
  const foodStationSeedHelper = testHelper.seedHelper(FoodStationSeedHelper);
  const dailyMemoSeedHelper = testHelper.seedHelper(DailyMemoSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /cafeteria/all', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('200 - empty response', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('200 - multiple cafeteria response', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria1 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 1',
      });
      const cafeteria2 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 2',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].idx).toBe(cafeteria1.idx);
      expect(response.body[0].name).toBe(cafeteria1.name);
      expect(response.body[1].idx).toBe(cafeteria2.idx);
      expect(response.body[1].name).toBe(cafeteria2.name);
    });

    it('200 - successfully get cafeteria list (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('200 - successfully get cafeteria list (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('401 - token not provided', async () => {
      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper.test().get('/cafeteria/all').expect(401);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const placeAdmin = testHelper.loginAdmin.magazineAdmin1;

      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${placeAdmin.token}`)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });
  });

  describe('POST /cafeteria', () => {
    it('201 - successfully create cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('401 - token not provided', async () => {
      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .send(createCafeteriaDto)
        .expect(401);
    });

    it('201 - successfully create cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('201 - successfully create cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('400 - name is empty', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: '',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(403);
    });
  });

  describe('PUT /cafeteria/:idx', () => {
    it('200 - successfully update cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('200 - successfully update cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('200 - successfully update cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put('/cafeteria/invalid-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(400);
    });

    it('400 - empty name', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: '',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put('/cafeteria/9999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(404);
    });
  });

  describe('DELETE /cafeteria/:idx', () => {
    it('200 - successfully delete cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/cafeteria/invalid-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/cafeteria/9999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  describe('POST /cafeteria/:copyToCafeteriaIdx/copy', () => {
    it('201 - date 범위 밖 데이터는 복사되지 않음', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      // 범위 내 food station (2024-01-01)
      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
        mealOfferingList: [
          {
            foodStationIdx: 0,
            servedDate: new Date('2024-01-01'),
          },
        ],
      });

      // 범위 밖 food station (2024-01-02)
      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-02'),
        mealOfferingList: [
          {
            foodStationIdx: 0,
            servedDate: new Date('2024-01-02'),
          },
        ],
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: fromCafeteria.idx,
        })
        .expect(201);

      const prisma = testHelper.getPrisma();
      const copiedStations = await prisma.foodStation.findMany({
        where: { cafeteriaIdx: toCafeteria.idx, deletedAt: null },
      });

      expect(copiedStations.length).toBe(1);
    });

    it('201 - fromIdx의 데이터만 복사되고 다른 식당 데이터는 복사되지 않음', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });
      const otherCafeteria = await cafeteriaSeedHelper.seed({
        name: 'other cafeteria',
      });
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
      });

      // 다른 식당의 같은 날짜 데이터
      await foodStationSeedHelper.seed({
        cafeteriaIdx: otherCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: fromCafeteria.idx,
        })
        .expect(201);

      const prisma = testHelper.getPrisma();
      const copiedStations = await prisma.foodStation.findMany({
        where: { cafeteriaIdx: toCafeteria.idx, deletedAt: null },
      });

      expect(copiedStations.length).toBe(1);
      expect(copiedStations[0].cafeteriaIdx).toBe(toCafeteria.idx);
    });

    it('409 - toCafeteria에 이미 food station 데이터가 존재하면 복사 불가', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
      });

      // toCafeteria에 이미 같은 날짜 데이터 존재
      await foodStationSeedHelper.seed({
        cafeteriaIdx: toCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: fromCafeteria.idx,
        })
        .expect(409);
    });

    it('409 - toCafeteria에 이미 daily memo 데이터가 존재하면 복사 불가', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-01'),
      });

      // toCafeteria에 이미 같은 날짜 daily memo 존재
      await dailyMemoSeedHelper.seed({
        cafeteriaIdx: toCafeteria.idx,
        date: new Date('2024-01-01'),
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: fromCafeteria.idx,
        })
        .expect(409);
    });

    it('404 - copyToCafeteriaIdx에 해당하는 식당이 존재하지 않음', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });

      await testHelper
        .test()
        .post('/cafeteria/9999/copy')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: fromCafeteria.idx,
        })
        .expect(404);
    });

    it('201 - food station, meal offering, meal item, daily memo가 모두 toCafeteria로 복사됨', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const fromCafeteria = await cafeteriaSeedHelper.seed({
        name: 'from cafeteria',
      });
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      const itemName = 'test menu item';
      const memoContent = 'test memo content';

      await foodStationSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        mealType: MealType.MEAL_LUNCH,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        mealOfferingList: [
          {
            foodStationIdx: 0,
            servedDate: new Date('2024-01-01'),
            mealItemList: [{ name: itemName, price: 5000 }],
          },
        ],
      });

      await dailyMemoSeedHelper.seed({
        cafeteriaIdx: fromCafeteria.idx,
        content: memoContent,
        date: new Date('2024-01-01'),
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-07',
          fromIdx: fromCafeteria.idx,
        })
        .expect(201);

      const prisma = testHelper.getPrisma();

      const copiedStations = await prisma.foodStation.findMany({
        where: { cafeteriaIdx: toCafeteria.idx, deletedAt: null },
        include: {
          mealOfferingList: {
            where: { deletedAt: null },
            include: {
              mealItemList: { where: { deletedAt: null } },
            },
          },
        },
      });

      expect(copiedStations.length).toBe(1);
      expect(copiedStations[0].mealOfferingList.length).toBe(1);
      expect(copiedStations[0].mealOfferingList[0].mealItemList.length).toBe(1);
      expect(copiedStations[0].mealOfferingList[0].mealItemList[0].name).toBe(
        itemName,
      );

      const copiedMemos = await prisma.dailyMemo.findMany({
        where: { cafeteriaIdx: toCafeteria.idx, deletedAt: null },
      });

      expect(copiedMemos.length).toBe(1);
      expect(copiedMemos[0].content).toBe(memoContent);
    });

    it('404 - fromIdx에 해당하는 식당이 존재하지 않음', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const toCafeteria = await cafeteriaSeedHelper.seed({
        name: 'to cafeteria',
      });

      await testHelper
        .test()
        .post(`/cafeteria/${toCafeteria.idx}/copy`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          fromIdx: 9999,
        })
        .expect(404);
    });
  });
});
