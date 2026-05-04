import { MealType } from '@libs/core/food-station/constants/meal-type.constant';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { DailyMemoSeedHelper } from '@libs/testing/seed/daily-memo/daily-memo.seed';
import { FoodStationSeedHelper } from '@libs/testing/seed/food-station/food-station.seed';
import { MealOfferingSeedHelper } from '@libs/testing/seed/meal-offering/meal-offering.seed';
import { GetFoodStationDto } from '@user/api/food-station/dto/request/get-food-station.dto';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('FoodStation E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const cafeteriaSeedHelper = testHelper.seedHelper(CafeteriaSeedHelper);
  const foodStationSeedHelper = testHelper.seedHelper(FoodStationSeedHelper);
  const mealOfferingSeedHelper = testHelper.seedHelper(MealOfferingSeedHelper);
  const dailyMemoSeedHelper = testHelper.seedHelper(DailyMemoSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /cafeteria/:idx/food-station', () => {
    it('200 - field check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStationSeed = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station',
        mealType: MealType.MEAL_BREAKFAST,
      });
      const mealOfferingSeed = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStationSeed.idx,
        kcal: 100,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item',
            price: 1000,
          },
        ],
      });
      const dailyMemoSeed = await dailyMemoSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        content: 'test daily memo',
        date: new Date('2026-04-20'),
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;
      const dailyMemo = response.body.dailyMemo;

      expect(foodStationList).toHaveLength(1);
      expect(foodStationList[0].idx).toBe(foodStationSeed.idx);
      expect(foodStationList[0].cafeteriaIdx).toBe(cafeteriaSeed.idx);
      expect(foodStationList[0].mealType).toBe(foodStationSeed.mealType);
      expect(foodStationList[0].name).toBe(foodStationSeed.name);

      const mealOffering = foodStationList[0].mealOffering;
      expect(mealOffering.idx).toBe(mealOfferingSeed.idx);
      expect(mealOffering.kcal).toBe(mealOfferingSeed.kcal);
      expect(mealOffering.startTime).toBe('08:00:00');
      expect(mealOffering.endTime).toBe('10:00:00');
      expect(mealOffering.servedDate).toBe('2026-04-20');

      const mealItemList = mealOffering.mealItemList;
      expect(mealItemList).toHaveLength(1);
      expect(mealItemList[0].name).toBe(mealOfferingSeed.mealItemList[0].name);
      expect(mealItemList[0].price).toBe(
        mealOfferingSeed.mealItemList[0].price,
      );
      expect(dailyMemo).not.toBeNull();
      expect(dailyMemo.content).toBe(dailyMemoSeed.content);
    });

    it('200 - no food station, no daily memo', async () => {
      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;
      const dailyMemo = response.body.dailyMemo;

      expect(foodStationList).toHaveLength(0);
      expect(dailyMemo).toBeNull();
    });

    it('200 - no daily memo but food station exists', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStationSeed = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station',
        mealType: MealType.MEAL_BREAKFAST,
      });
      await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStationSeed.idx,
        kcal: 100,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item',
            price: 1000,
          },
        ],
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;
      const dailyMemo = response.body.dailyMemo;

      expect(foodStationList).toHaveLength(1);
      expect(dailyMemo).toBeNull();
    });

    it('200 - single food station and multiple meal items', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStationSeed = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station',
        mealType: MealType.MEAL_BREAKFAST,
      });
      const mealOfferingSeed = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStationSeed.idx,
        kcal: 100,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item 1',
            price: 1000,
          },
          {
            name: 'test meal item 2',
            price: 2000,
          },
        ],
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);
      expect(foodStationList[0].idx).toBe(foodStationSeed.idx);
      expect(foodStationList[0].cafeteriaIdx).toBe(cafeteriaSeed.idx);
      expect(foodStationList[0].mealType).toBe(foodStationSeed.mealType);
      expect(foodStationList[0].name).toBe(foodStationSeed.name);

      const mealOffering = foodStationList[0].mealOffering;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.idx).toBe(mealOfferingSeed.idx);
      expect(mealOffering.kcal).toBe(mealOfferingSeed.kcal);
      expect(mealOffering.startTime).toBe('08:00:00');
      expect(mealOffering.endTime).toBe('10:00:00');
      expect(mealOffering.servedDate).toBe('2026-04-20');

      const mealItemList = mealOffering.mealItemList;
      expect(mealItemList).toHaveLength(2);
      expect(mealItemList[0].name).toBe(mealOfferingSeed.mealItemList[0].name);
      expect(mealItemList[0].price).toBe(
        mealOfferingSeed.mealItemList[0].price,
      );
      expect(mealItemList[1].name).toBe(mealOfferingSeed.mealItemList[1].name);
      expect(mealItemList[1].price).toBe(
        mealOfferingSeed.mealItemList[1].price,
      );
    });

    it('200 - multiple food stations', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStationSeed1 = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station 1',
        mealType: MealType.MEAL_BREAKFAST,
      });
      const foodStationSeed2 = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station 2',
        mealType: MealType.MEAL_LUNCH,
      });
      const mealOfferingSeed1 = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStationSeed1.idx,
        kcal: 100,
        startTime: now.new('08:00'),
        endTime: now.new('10:00'),
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item 1',
            price: 1000,
          },
        ],
      });
      const mealOfferingSeed2 = await mealOfferingSeedHelper.seed({
        foodStationIdx: foodStationSeed2.idx,
        kcal: 200,
        startTime: now.new('11:00'),
        endTime: now.new('13:00'),
        servedDate: new Date('2026-04-20'),
        mealItemList: [
          {
            name: 'test meal item 2',
            price: 2000,
          },
        ],
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;

      expect(foodStationList).toHaveLength(2);

      const mealOffering1 = foodStationList[0].mealOffering;
      expect(mealOffering1).toBeDefined();
      expect(mealOffering1.idx).toBe(mealOfferingSeed1.idx);
      expect(mealOffering1.kcal).toBe(mealOfferingSeed1.kcal);
      expect(mealOffering1.startTime).toBe('08:00:00');
      expect(mealOffering1.endTime).toBe('10:00:00');
      expect(mealOffering1.servedDate).toBe('2026-04-20');

      const mealOffering2 = foodStationList[1].mealOffering;
      expect(mealOffering2).toBeDefined();
      expect(mealOffering2.idx).toBe(mealOfferingSeed2.idx);
      expect(mealOffering2.kcal).toBe(mealOfferingSeed2.kcal);
      expect(mealOffering2.startTime).toBe('11:00:00');
      expect(mealOffering2.endTime).toBe('13:00:00');
      expect(mealOffering2.servedDate).toBe('2026-04-20');

      const mealItemList1 = mealOffering1.mealItemList;
      expect(mealItemList1).toHaveLength(1);
      expect(mealItemList1[0].name).toBe(
        mealOfferingSeed1.mealItemList[0].name,
      );
      expect(mealItemList1[0].price).toBe(
        mealOfferingSeed1.mealItemList[0].price,
      );

      const mealItemList2 = mealOffering2.mealItemList;
      expect(mealItemList2).toHaveLength(1);
      expect(mealItemList2[0].name).toBe(
        mealOfferingSeed2.mealItemList[0].name,
      );
      expect(mealItemList2[0].price).toBe(
        mealOfferingSeed2.mealItemList[0].price,
      );
    });

    it('200 - food station with no meal offering', async () => {
      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const foodStationSeed = await foodStationSeedHelper.seed({
        cafeteriaIdx: cafeteriaSeed.idx,
        name: 'test food station',
        mealType: MealType.MEAL_BREAKFAST,
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;

      expect(foodStationList).toHaveLength(0);
    });

    it('200 - successfully get food station for a specific cafeteria among multiple food stations', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed1 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 1',
      });
      const cafeteriaSeed2 = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria 2',
      });
      const [foodStationSeed1, foodStationSeed2] = await Promise.all([
        foodStationSeedHelper.seed({
          cafeteriaIdx: cafeteriaSeed1.idx,
          name: 'test food station 1',
          mealType: MealType.MEAL_BREAKFAST,
        }),
        foodStationSeedHelper.seed({
          cafeteriaIdx: cafeteriaSeed2.idx,
          name: 'test food station 2',
          mealType: MealType.MEAL_LUNCH,
        }),
      ]);
      const [mealOfferingSeed1, mealOfferingSeed2] = await Promise.all([
        mealOfferingSeedHelper.seed({
          foodStationIdx: foodStationSeed1.idx,
          servedDate: new Date('2026-04-20'),
          kcal: 100,
          startTime: now.new('08:00'),
          endTime: now.new('10:00'),
          mealItemList: [
            {
              name: 'test meal item 1',
              price: 1000,
            },
          ],
        }),
        mealOfferingSeedHelper.seed({
          foodStationIdx: foodStationSeed2.idx,
          servedDate: new Date('2026-04-20'),
          kcal: 200,
          startTime: now.new('11:00'),
          endTime: now.new('13:00'),
          mealItemList: [
            {
              name: 'test meal item 2',
              price: 2000,
            },
          ],
        }),
      ]);

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed1.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);
      expect(foodStationList[0].idx).toBe(foodStationSeed1.idx);
      expect(foodStationList[0].cafeteriaIdx).toBe(cafeteriaSeed1.idx);
      expect(foodStationList[0].mealType).toBe(foodStationSeed1.mealType);
      expect(foodStationList[0].name).toBe(foodStationSeed1.name);

      const mealOffering = foodStationList[0].mealOffering;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.idx).toBe(mealOfferingSeed1.idx);
      expect(mealOffering.kcal).toBe(mealOfferingSeed1.kcal);
      expect(mealOffering.startTime).toBe('08:00:00');
      expect(mealOffering.endTime).toBe('10:00:00');
      expect(mealOffering.servedDate).toBe('2026-04-20');

      const mealItemList = mealOffering.mealItemList;
      expect(mealItemList).toHaveLength(1);
      expect(mealItemList[0].name).toBe(mealOfferingSeed1.mealItemList[0].name);
      expect(mealItemList[0].price).toBe(
        mealOfferingSeed1.mealItemList[0].price,
      );
    });

    it('200 - successfully get food station for a specific date among multiple food stations with different served dates', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });
      const [foodStationSeed1, foodStationSeed2] = await Promise.all([
        foodStationSeedHelper.seed({
          cafeteriaIdx: cafeteriaSeed.idx,
          name: 'test food station 1',
          mealType: MealType.MEAL_BREAKFAST,
        }),
        foodStationSeedHelper.seed({
          cafeteriaIdx: cafeteriaSeed.idx,
          name: 'test food station 2',
          mealType: MealType.MEAL_LUNCH,
        }),
      ]);
      const [mealOfferingSeed1, mealOfferingSeed2] = await Promise.all([
        mealOfferingSeedHelper.seed({
          foodStationIdx: foodStationSeed1.idx,
          servedDate: new Date('2026-04-20'),
          kcal: 100,
          startTime: now.new('08:00'),
          endTime: now.new('10:00'),
          mealItemList: [
            {
              name: 'test meal item 1',
              price: 1000,
            },
          ],
        }),
        mealOfferingSeedHelper.seed({
          foodStationIdx: foodStationSeed2.idx,
          servedDate: new Date('2026-04-21'),
          kcal: 200,
          startTime: now.new('11:00'),
          endTime: now.new('13:00'),
          mealItemList: [
            {
              name: 'test meal item 2',
              price: 2000,
            },
          ],
        }),
      ]);

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      const response = await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(200);

      const foodStationList = response.body.foodStationList;

      expect(foodStationList).toHaveLength(1);
      expect(foodStationList[0].idx).toBe(foodStationSeed1.idx);
      expect(foodStationList[0].cafeteriaIdx).toBe(
        foodStationSeed1.cafeteriaIdx,
      );
      expect(foodStationList[0].mealType).toBe(foodStationSeed1.mealType);
      expect(foodStationList[0].name).toBe(foodStationSeed1.name);

      const mealOffering = foodStationList[0].mealOffering;
      expect(mealOffering).toBeDefined();
      expect(mealOffering.idx).toBe(mealOfferingSeed1.idx);
      expect(mealOffering.kcal).toBe(mealOfferingSeed1.kcal);
      expect(mealOffering.startTime).toBe('08:00:00');
      expect(mealOffering.endTime).toBe('10:00:00');
      expect(mealOffering.servedDate).toBe('2026-04-20');

      const mealItemList = mealOffering.mealItemList;
      expect(mealItemList).toHaveLength(1);
      expect(mealItemList[0].name).toBe(mealOfferingSeed1.mealItemList[0].name);
      expect(mealItemList[0].price).toBe(
        mealOfferingSeed1.mealItemList[0].price,
      );
    });

    it('400 - invalid request', async () => {
      const cafeteriaSeed = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: 'invalid date',
      };

      await testHelper
        .test()
        .get(`/cafeteria/${cafeteriaSeed.idx}/food-station`)
        .query(GetFoodStationDto)
        .expect(400);
    });

    it('404 - cafeteria not found', async () => {
      const GetFoodStationDto: GetFoodStationDto = {
        servedDate: '2026-04-20',
      };

      await testHelper
        .test()
        .get(`/cafeteria/9999/food-station`)
        .query(GetFoodStationDto)
        .expect(404);
    });
  });
});
