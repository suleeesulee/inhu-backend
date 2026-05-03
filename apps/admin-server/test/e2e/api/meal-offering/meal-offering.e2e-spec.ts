import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { FoodStationSeedHelper } from '@libs/testing/seed/food-station/food-station.seed';
import { MealOfferingSeedHelper } from '@libs/testing/seed/meal-offering/meal-offering.seed';
import { CreateMealOfferingDto } from '@admin/api/meal-offering/dto/request/create-meal-offering.dto';
import { UpdateMealOfferingDto } from '@admin/api/meal-offering/dto/request/update-meal-offering.dto';
import { MealOfferingCoreService } from '@libs/core/meal-offering/meal-offering-core.service';

describe('Cafeteria e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const cafeteriaSeedHelper = testHelper.seedHelper(CafeteriaSeedHelper);
  const foodStationSeedHelper = testHelper.seedHelper(FoodStationSeedHelper);
  const mealOfferingSeedHelper = testHelper.seedHelper(MealOfferingSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /food-station/:idx/meal-offering', () => {
    it('successfully create meal offering', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      const response = await testHelper
        .test()
        .post(`/food-station/${foodStation.idx}/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(201);

      const mealOffering = response.body;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.startTime).toBe(createMealOfferingDto.startTime);
      expect(mealOffering.endTime).toBe(createMealOfferingDto.endTime);
      expect(mealOffering.kcal).toBe(createMealOfferingDto.kcal);
      expect(mealOffering.servedDate).toBe(createMealOfferingDto.servedDate);
      expect(mealOffering.mealItemList).toHaveLength(
        createMealOfferingDto.mealItemList.length,
      );
      expect(mealOffering.mealItemList[0].name).toBe(
        createMealOfferingDto.mealItemList[0].name,
      );
      expect(mealOffering.mealItemList[0].price).toBe(
        createMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully create meal offering (super admin)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      const response = await testHelper
        .test()
        .post(`/food-station/${foodStation.idx}/meal-offering`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createMealOfferingDto)
        .expect(201);

      const mealOffering = response.body;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.startTime).toBe(createMealOfferingDto.startTime);
      expect(mealOffering.endTime).toBe(createMealOfferingDto.endTime);
      expect(mealOffering.kcal).toBe(createMealOfferingDto.kcal);
      expect(mealOffering.servedDate).toBe(createMealOfferingDto.servedDate);
      expect(mealOffering.mealItemList).toHaveLength(
        createMealOfferingDto.mealItemList.length,
      );
      expect(mealOffering.mealItemList[0].name).toBe(
        createMealOfferingDto.mealItemList[0].name,
      );
      expect(mealOffering.mealItemList[0].price).toBe(
        createMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully create meal offering (admin)', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      const response = await testHelper
        .test()
        .post(`/food-station/${foodStation.idx}/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(201);

      const mealOffering = response.body;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.startTime).toBe(createMealOfferingDto.startTime);
      expect(mealOffering.endTime).toBe(createMealOfferingDto.endTime);
      expect(mealOffering.kcal).toBe(createMealOfferingDto.kcal);
      expect(mealOffering.servedDate).toBe(createMealOfferingDto.servedDate);
      expect(mealOffering.mealItemList).toHaveLength(
        createMealOfferingDto.mealItemList.length,
      );
      expect(mealOffering.mealItemList[0].name).toBe(
        createMealOfferingDto.mealItemList[0].name,
      );
      expect(mealOffering.mealItemList[0].price).toBe(
        createMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully create multiple meal item', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      };

      const response = await testHelper
        .test()
        .post(`/food-station/${foodStation.idx}/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(201);

      const mealOffering = response.body;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.startTime).toBe(createMealOfferingDto.startTime);
      expect(mealOffering.endTime).toBe(createMealOfferingDto.endTime);
      expect(mealOffering.kcal).toBe(createMealOfferingDto.kcal);
      expect(mealOffering.servedDate).toBe(createMealOfferingDto.servedDate);
      expect(mealOffering.mealItemList).toHaveLength(
        createMealOfferingDto.mealItemList.length,
      );
      expect(mealOffering.mealItemList[0].name).toBe(
        createMealOfferingDto.mealItemList[0].name,
      );
      expect(mealOffering.mealItemList[0].price).toBe(
        createMealOfferingDto.mealItemList[0].price,
      );
      expect(mealOffering.mealItemList[1].name).toBe(
        createMealOfferingDto.mealItemList[1].name,
      );
      expect(mealOffering.mealItemList[1].price).toBe(
        createMealOfferingDto.mealItemList[1].price,
      );
    });

    it('400 - invalid food station idx', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .post(`/food-station/invalid_idx/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(400);
    });

    it('401 - token not provided', async () => {
      const response = await testHelper
        .test()
        .post(`/food-station/1/meal-offering`)
        .send({})
        .expect(401);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;

      const response = await testHelper
        .test()
        .post(`/food-station/1/meal-offering`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({})
        .expect(403);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;

      const response = await testHelper
        .test()
        .post(`/food-station/1/meal-offering`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send({})
        .expect(403);
    });

    it('404 - food station not found', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .post(`/food-station/9999/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(404);
    });

    it('409 - meal offering already exists for the served date', async () => {
      const admin = await testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        servedDate: new Date('2026-04-20'),
      });

      const createMealOfferingDto: CreateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '09:00:00',
        kcal: 500,
        servedDate: '2026-04-20',
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .post(`/food-station/${foodStation.idx}/meal-offering`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createMealOfferingDto)
        .expect(409);
    });
  });

  describe('PUT /meal-offering/:idx', () => {
    it('200 - successfully update meal offering', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('09:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '10:00:00',
        endTime: '11:00:00',
        kcal: 600,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe(
        updateMealOfferingDto.startTime,
      );
      expect(updatedMealOffering.endTime).toBe(updateMealOfferingDto.endTime);
      expect(updatedMealOffering.kcal).toBe(updateMealOfferingDto.kcal);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update meal offering (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('09:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '10:00:00',
        endTime: '11:00:00',
        kcal: 600,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe(
        updateMealOfferingDto.startTime,
      );
      expect(updatedMealOffering.endTime).toBe(updateMealOfferingDto.endTime);
      expect(updatedMealOffering.kcal).toBe(updateMealOfferingDto.kcal);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update meal offering (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('09:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '10:00:00',
        endTime: '11:00:00',
        kcal: 600,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe(
        updateMealOfferingDto.startTime,
      );
      expect(updatedMealOffering.endTime).toBe(updateMealOfferingDto.endTime);
      expect(updatedMealOffering.kcal).toBe(updateMealOfferingDto.kcal);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update only start time', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '09:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe(
        updateMealOfferingDto.startTime,
      );
      expect(updatedMealOffering.endTime).toBe('10:00:00');
      expect(updatedMealOffering.kcal).toBe(500);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        mealOffering.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        mealOffering.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        mealOffering.mealItemList[0].price,
      );
    });

    it('200 - successfully update only end time', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '11:00:00',
        kcal: 500,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe('08:00:00');
      expect(updatedMealOffering.endTime).toBe(updateMealOfferingDto.endTime);
      expect(updatedMealOffering.kcal).toBe(500);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        mealOffering.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        mealOffering.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        mealOffering.mealItemList[0].price,
      );
    });

    it('200 - successfully update only kcal', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 600,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe('08:00:00');
      expect(updatedMealOffering.endTime).toBe('10:00:00');
      expect(updatedMealOffering.kcal).toBe(updateMealOfferingDto.kcal);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        mealOffering.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        mealOffering.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        mealOffering.mealItemList[0].price,
      );
    });

    it('200 -  successfully update only meal item list', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe('08:00:00');
      expect(updatedMealOffering.endTime).toBe('10:00:00');
      expect(updatedMealOffering.kcal).toBe(500);
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update meal offering with empty meal item list', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.startTime).toBe('08:00:00');
      expect(updatedMealOffering.endTime).toBe('10:00:00');
      expect(updatedMealOffering.kcal).toBe(500);
      expect(updatedMealOffering.mealItemList).toHaveLength(0);
    });

    it('200 - successfully update meal item only name', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        mealOffering.mealItemList[0].price,
      );
    });

    it('200 - successfully update meal item only price', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        mealOffering.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update meal item price to null', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        mealOffering.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBeNull();
    });

    it('200 - successfully update meal item single to multiple', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
      expect(updatedMealOffering.mealItemList[1].name).toBe(
        updateMealOfferingDto.mealItemList[1].name,
      );
      expect(updatedMealOffering.mealItemList[1].price).toBe(
        updateMealOfferingDto.mealItemList[1].price,
      );
    });

    it('200 - successfully update meal item multiple to single', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
    });

    it('200 - successfully update some meal items and keep some meal items', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Updated Meal Item 2',
            price: 4500,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
      expect(updatedMealOffering.mealItemList[1].name).toBe(
        updateMealOfferingDto.mealItemList[1].name,
      );
      expect(updatedMealOffering.mealItemList[1].price).toBe(
        updateMealOfferingDto.mealItemList[1].price,
      );
    });

    it('200 - successfully update some meal item name and keep some meal item name', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Updated Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
      expect(updatedMealOffering.mealItemList[1].name).toBe(
        updateMealOfferingDto.mealItemList[1].name,
      );
      expect(updatedMealOffering.mealItemList[1].price).toBe(
        updateMealOfferingDto.mealItemList[1].price,
      );
    });

    it('200 - successfully update some meal item price and keep some meal item price', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3500,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBe(
        updateMealOfferingDto.mealItemList[0].price,
      );
      expect(updatedMealOffering.mealItemList[1].name).toBe(
        updateMealOfferingDto.mealItemList[1].name,
      );
      expect(updatedMealOffering.mealItemList[1].price).toBe(
        updateMealOfferingDto.mealItemList[1].price,
      );
    });

    it('200 - successfully update some meal item price to null and keep some meal item price', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
          },
          {
            name: 'Meal Item 2',
            price: 4000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(200);

      const updatedMealOffering = await testHelper
        .get(MealOfferingCoreService)
        .getMealOfferingByIdx(mealOffering.idx);

      if (!updatedMealOffering) {
        throw new Error('Updated meal offering not found');
      }

      expect(updatedMealOffering).toBeDefined();
      expect(updatedMealOffering.mealItemList).toHaveLength(
        updateMealOfferingDto.mealItemList.length,
      );
      expect(updatedMealOffering.mealItemList[0].name).toBe(
        updateMealOfferingDto.mealItemList[0].name,
      );
      expect(updatedMealOffering.mealItemList[0].price).toBeNull();
      expect(updatedMealOffering.mealItemList[1].name).toBe(
        updateMealOfferingDto.mealItemList[1].name,
      );
      expect(updatedMealOffering.mealItemList[1].price).toBe(
        updateMealOfferingDto.mealItemList[1].price,
      );
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/invalid-idx`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(400);
    });

    it('400 - start time is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto = {
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(400);
    });

    it('400 - end time is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto = {
        startTime: '08:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(400);
    });

    it('400 - name of meal item is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .send(updateMealOfferingDto)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: mealOffering.mealItemList.map((mealItem) => ({
          name: mealItem.name,
          price: mealItem.price,
        })),
      };

      await testHelper
        .test()
        .put(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(403);
    });

    it('404 - meal offering not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateMealOfferingDto: UpdateMealOfferingDto = {
        startTime: '08:00:00',
        endTime: '10:00:00',
        kcal: 500,
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      };

      await testHelper
        .test()
        .put(`/meal-offering/9999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateMealOfferingDto)
        .expect(404);
    });
  });

  describe('DELETE /meal-offering/:idx', () => {
    it('200 - successfully delete meal offering', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      await testHelper
        .test()
        .delete(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedMealOffering = await prisma.mealOffering.findUnique({
        where: { idx: mealOffering.idx },
      });

      expect(deletedMealOffering?.deletedAt).not.toBeNull();
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/meal-offering/invalid-idx`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - token is missing', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      await testHelper
        .test()
        .delete(`/meal-offering/${mealOffering.idx}`)
        .expect(401);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      await testHelper
        .test()
        .delete(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'Test Cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'Meal Item 1',
            price: 3000,
          },
        ],
      });

      await testHelper
        .test()
        .delete(`/meal-offering/${mealOffering.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(403);
    });

    it('404 - meal offering not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/meal-offering/9999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
