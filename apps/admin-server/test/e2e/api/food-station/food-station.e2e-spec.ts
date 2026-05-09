import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { FoodStationSeedHelper } from '@libs/testing/seed/food-station/food-station.seed';
import { MealOfferingSeedHelper } from '@libs/testing/seed/meal-offering/meal-offering.seed';
import { GetFoodStationAllDto } from '@admin/api/food-station/dto/request/get-food-station-all.dto';
import { FoodStationEntity } from '@admin/api/food-station/entity/food-station.entity';
import { MealType } from '@libs/core/food-station/constants/meal-type.constant';
import { CreateFoodStationDto } from '@admin/api/food-station/dto/request/create-food-station.dto';
import { UpdateFoodStationDto } from '@admin/api/food-station/dto/request/update-food-station.dto';
import { FoodStationCoreService } from '@libs/core/food-station/food-station-core.service';

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

  describe('GET /cafeteria/:idx/food-station/all', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });
      const mealOffering = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStation.idx,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        kcal: 500,
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item 1',
            price: 3000,
          },
        ],
      });

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(200);

      const foodStationList: FoodStationEntity[] =
        response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);

      const foodStationResponse = foodStationList[0];

      expect(foodStationResponse.idx).toBe(foodStation.idx);
      expect(foodStationResponse.cafeteriaIdx).toBe(cafeteria.idx);
      expect(foodStationResponse.mealType).toBe(foodStation.mealType);
      expect(foodStationResponse.name).toBe(foodStation.name);
      expect(foodStationResponse.startTime).toBe('08:00:00');
      expect(foodStationResponse.endTime).toBe('10:00:00');
      expect(foodStationResponse.startDate).toBe('2026-04-20');
      expect(foodStationResponse.endDate).toBe('2026-04-26');

      const mealOfferingResponse = foodStationResponse.mealOfferingList[0];

      expect(mealOfferingResponse.idx).toBe(mealOffering.idx);
      expect(mealOfferingResponse.startTime).toBe('08:00:00');
      expect(mealOfferingResponse.endTime).toBe('10:00:00');
      expect(mealOfferingResponse.kcal).toBe(mealOffering.kcal);
      expect(mealOfferingResponse.servedDate).toBe('2026-04-20');
      expect(mealOfferingResponse.createdAt).toBeTruthy();

      const mealItemResponse = mealOfferingResponse.mealItemList[0];

      expect(mealItemResponse.name).toBe(mealOffering.mealItemList[0].name);
      expect(mealItemResponse.price).toBe(mealOffering.mealItemList[0].price);
    });

    it('200 - get empty food station list', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(200);

      const foodStationList: FoodStationEntity[] =
        response.body.foodStationList;

      expect(foodStationList).toHaveLength(0);
    });

    it('200 - get empty meal offering list', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(200);

      const foodStationList: FoodStationEntity[] =
        response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);

      const foodStationResponse = foodStationList[0];

      expect(foodStationResponse.mealOfferingList).toHaveLength(0);
    });

    it('200 - get single food station and multiple meal offerings', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });
      await mealOfferingSeedHelper.seedAll([
        {
          foodStationIdx: foodStation.idx,
          startTime: now.new('08:00'),
          endTime: now.new('10:00'),
          kcal: 500,
          servedDate: new Date('2026-04-20'),
          mealItemList: [
            {
              name: 'test meal item 1',
              price: 3000,
            },
          ],
        },
        {
          foodStationIdx: foodStation.idx,
          startTime: now.new('08:00'),
          endTime: now.new('10:00'),
          kcal: 600,
          servedDate: new Date('2026-04-21'),
          mealItemList: [
            {
              name: 'test meal item 2',
              price: 3500,
            },
          ],
        },
      ]);

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteria.idx}/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(200);

      const foodStationList: FoodStationEntity[] =
        response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);

      const foodStationResponse = foodStationList[0];

      expect(foodStationResponse.mealOfferingList).toHaveLength(2);
    });

    // it('200 - get multiple food stations and multiple meal offerings', async () => {
    //   const admin = testHelper.loginAdmin.admin1;
    //   const now = testHelper.mockTodayTime('10:00');

    //   const cafeteria = await cafeteriaSeedHelper.seed({
    //     name: 'test cafeteria',
    //   });
    //   const foodStation1 = await foodStationSeedHelper.seed({
    //     cafeteriaIdx: cafeteria.idx,
    //     mealType: MealType.MEAL_BREAKFAST,
    //     name: 'test food station 1',
    //     startTime: now.new('08:00'),
    //     endTime: now.new('10:00'),
    //     startDate: new Date('2026-04-20'),
    //     endDate: new Date('2026-04-26'),
    //   });
    //   const foodStation2 = await foodStationSeedHelper.seed({
    //     cafeteriaIdx: cafeteria.idx,
    //     mealType: MealType.MEAL_LUNCH,
    //     name: 'test food station 2',
    //     startTime: now.new('11:00'),
    //     endTime: now.new('14:00'),
    //     startDate: new Date('2026-04-20'),
    //     endDate: new Date('2026-04-26'),
    //   });
    //   await mealOfferingSeedHelper.seedAll([
    //     {
    //       foodStationIdx: foodStation1.idx,
    //       startTime: now.new('08:00'),
    //       endTime: now.new('10:00'),
    //       kcal: 500,
    //       servedDate: new Date('2026-04-20'),
    //       mealItemList: [
    //         {
    //           name: 'test meal item 1',
    //           price: 3000,
    //         },
    //       ],
    //     },
    //     {
    //       foodStationIdx: foodStation2.idx,
    //       startTime: now.new('11:00'),
    //       endTime: now.new('14:00'),
    //       kcal: 700,
    //       servedDate: new Date('2026-04-20'),
    //       mealItemList: [
    //         {
    //           name: 'test meal item 2',
    //           price: 4000,
    //         },
    //       ],
    //     },
    //   ]);

    //   const getFoodStationAllDto: GetFoodStationAllDto = {
    //     startDate: '2026-04-20',
    //     endDate: '2026-04-26',
    //   };

    //   const response = await testHelper
    //     .test()
    //     .get(`/cafeteria/${cafeteria.idx}/food-station/all`)
    //     .set('Cookie', `token=Bearer ${admin.token}`)
    //     .query(getFoodStationAllDto)
    //     .expect(200);

    //   const foodStationList: FoodStationEntity[] =
    //     response.body.foodStationList;

    //   expect(foodStationList).toHaveLength(2);
    // });

    it('400 - invalid cafeteria idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/invalid_idx/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(400);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/1/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/1/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const getFoodStationAllDto: GetFoodStationAllDto = {
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .get(`/cafeteria/9999/food-station/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query(getFoodStationAllDto)
        .expect(404);
    });
  });

  describe('POST /cafeteria/:idx/food-station', () => {
    it('successfully create food station', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const createFoodStationDto: CreateFoodStationDto = {
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      const response = await testHelper
        .test()
        .post(`/cafeteria/${cafeteria.idx}/food-station`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createFoodStationDto)
        .expect(201);

      const foodStationResponse: FoodStationEntity = response.body;

      expect(foodStationResponse.idx).toBeTruthy();
      expect(foodStationResponse.cafeteriaIdx).toBe(cafeteria.idx);
      expect(foodStationResponse.mealType).toBe(createFoodStationDto.mealType);
      expect(foodStationResponse.name).toBe(createFoodStationDto.name);
      expect(foodStationResponse.startTime).toBe(
        createFoodStationDto.startTime,
      );
      expect(foodStationResponse.endTime).toBe(createFoodStationDto.endTime);
      expect(foodStationResponse.startDate).toBe(
        createFoodStationDto.startDate,
      );
      expect(foodStationResponse.endDate).toBe(createFoodStationDto.endDate);
    });

    it('400 - invalid cafeteria idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createFoodStationDto: CreateFoodStationDto = {
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .post(`/cafeteria/invalid_idx/food-station`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createFoodStationDto)
        .expect(400);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;

      const createFoodStationDto: CreateFoodStationDto = {
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .post(`/cafeteria/1/food-station`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createFoodStationDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;

      const createFoodStationDto: CreateFoodStationDto = {
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .post(`/cafeteria/1/food-station`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createFoodStationDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createFoodStationDto: CreateFoodStationDto = {
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
        startDate: '2026-04-20',
        endDate: '2026-04-26',
      };

      await testHelper
        .test()
        .post(`/cafeteria/9999/food-station`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createFoodStationDto)
        .expect(404);
    });
  });

  describe('PUT /food-station/:idx', () => {
    it('200 - successfully update food station', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(200);

      const updatedFoodStation = await testHelper
        .get(FoodStationCoreService)
        .getFoodStationByIdx(foodStation.idx);

      if (!updatedFoodStation) {
        throw new Error('updated food station not found');
      }

      expect(updatedFoodStation).not.toBeNull();
      expect(updatedFoodStation.name).toBe(updateFoodStationDto.name);
      expect(updatedFoodStation.startTime).toBe('09:00:00');
      expect(updatedFoodStation.endTime).toBe('11:00:00');
    });

    it('200 - successfully update only name', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '08:00:00',
        endTime: '10:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(200);

      const updatedFoodStation = await testHelper
        .get(FoodStationCoreService)
        .getFoodStationByIdx(foodStation.idx);

      if (!updatedFoodStation) {
        throw new Error('updated food station not found');
      }

      expect(updatedFoodStation).not.toBeNull();
      expect(updatedFoodStation.name).toBe(updateFoodStationDto.name);
      expect(updatedFoodStation.startTime).toBe('08:00:00');
      expect(updatedFoodStation.endTime).toBe('10:00:00');
    });

    it('200 - successfully update only start time', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'test food station',
        startTime: '09:00:00',
        endTime: '10:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(200);

      const updatedFoodStation = await testHelper
        .get(FoodStationCoreService)
        .getFoodStationByIdx(foodStation.idx);

      if (!updatedFoodStation) {
        throw new Error('updated food station not found');
      }

      expect(updatedFoodStation).not.toBeNull();
      expect(updatedFoodStation.name).toBe(updateFoodStationDto.name);
      expect(updatedFoodStation.startTime).toBe('09:00:00');
      expect(updatedFoodStation.endTime).toBe('10:00:00');
    });

    it('200 - successfully update only end time', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'test food station',
        startTime: '08:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(200);

      const updatedFoodStation = await testHelper
        .get(FoodStationCoreService)
        .getFoodStationByIdx(foodStation.idx);

      if (!updatedFoodStation) {
        throw new Error('updated food station not found');
      }

      expect(updatedFoodStation).not.toBeNull();
      expect(updatedFoodStation.name).toBe(updateFoodStationDto.name);
      expect(updatedFoodStation.startTime).toBe('08:00:00');
      expect(updatedFoodStation.endTime).toBe('11:00:00');
    });

    it('400 - invalid food station idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/invalid_idx`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(400);
    });

    it('400 - invalid time format', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: 'invalid_time',
        endTime: 'invalid_time',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(400);
    });

    it('400 - start time is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto = {
        name: 'updated food station',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(400);
    });

    it('400 - end time is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(400);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(403);
    });

    it('404 - food station not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateFoodStationDto: UpdateFoodStationDto = {
        name: 'updated food station',
        startTime: '09:00:00',
        endTime: '11:00:00',
      };

      await testHelper
        .test()
        .put(`/food-station/9999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateFoodStationDto)
        .expect(404);
    });
  });

  describe('DELETE /food-station/:idx', () => {
    it('200 - successfully delete food station', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      await testHelper
        .test()
        .delete(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedFoodStation = await prisma.foodStation.findUnique({
        where: { idx: foodStation.idx },
      });

      expect(deletedFoodStation?.deletedAt).toBeTruthy();
    });

    it('400 - invalid food station idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/food-station/invalid_idx`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('403 - unauthorized access (all admin)', async () => {
      const admin = testHelper.loginAdmin.allAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      await testHelper
        .test()
        .delete(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(403);
    });

    it('403 - unauthorized access (magazine admin)', async () => {
      const admin = testHelper.loginAdmin.magazineAdmin1;
      const now = testHelper.mockTodayTime('10:00');

      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStation = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteria.idx,
        mealType: MealType.MEAL_BREAKFAST,
        name: 'test food station',
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-26'),
      });

      await testHelper
        .test()
        .delete(`/food-station/${foodStation.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(403);
    });

    it('404 - food station not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete(`/food-station/9999`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
