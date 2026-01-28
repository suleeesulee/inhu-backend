import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { ConfigService } from '@nestjs/config';
import { RouletteItemEntity } from '@user/api/roulette/entity/roulette-item.entity';
import { RouletteService } from '@user/api/roulette/roulette.service';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Roulette E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /roulette-item', () => {
    it('field check', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        roadAddress: {
          name: 'test road address',
          detail: 'detail',
          addressX: 127.0,
          addressY: 37.0,
        },
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        type: PlaceType.CAFE,
        mainCategoryList: [MainCategory.BAKERY, MainCategory.BUNGEOPPANG],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          // operating: true,
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.STUDY_FRIENDLY],
        })
        .expect(200);

      const place: RouletteItemEntity = response.body.rouletteItemList[0];

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.imagePathList.sort()).toEqual(placeSeed.placeImgList.sort());
    });

    it('weight check', async () => {
      const [place1, place2, place3, place4] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 4',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
      ]);

      const targetPlaceIdxList = [place1.idx, place3.idx];
      const multiplier = 3;

      const rouletteService = testHelper.get(RouletteService);
      (rouletteService as any).TARGET_PLACE_IDX_LIST = targetPlaceIdxList;
      (rouletteService as any).MULTIPLIER = multiplier;

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      expect(
        rouletteItemList.find((item) => item.idx === place1.idx)?.weight,
      ).toBe(multiplier);
      expect(
        rouletteItemList.find((item) => item.idx === place3.idx)?.weight,
      ).toBe(multiplier);
      expect(
        rouletteItemList.find((item) => item.idx === place2.idx)?.weight,
      ).toBe(1);
      expect(
        rouletteItemList.find((item) => item.idx === place4.idx)?.weight,
      ).toBe(1);
    });

    it('operating filter check (operating === true)', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4, place5] =
        await placeSeedHelper.seedAll([
          {
            // place1:
            name: '오늘 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('4h'),
                endAt: now.after('1h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place2
            name: '내일 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.dayAfter(1),
                startAt: now.after('1h'),
                endAt: now.after('2h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place3
            name: '운영 정보가 없는 가게',
            activatedAt: new Date(),
          },
          {
            // place4
            name: '오늘 운영하지만 앞으로 두 시간 뒤에 운영할 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.after('2h'),
                endAt: now.after('4h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place5
            name: '오늘 지금 시간에 운영하되 오늘 운영 정보가 하나 더 있는 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('1h'),
                endAt: now.after('2h'),
              },
              {
                day: now.day(),
                startAt: now.before('2h'),
                endAt: now.before('1h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
        ]);

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          operating: true,
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      const rouletteItemIdxSet = new Set(
        rouletteItemList.map((item) => item.idx),
      );

      expect(rouletteItemIdxSet.has(place1.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place5.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place2.idx)).toBe(false);
      expect(rouletteItemIdxSet.has(place3.idx)).toBe(false);
      expect(rouletteItemIdxSet.has(place4.idx)).toBe(false);
    });

    it('operating filter check (operating === undefined)', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4, place5] =
        await placeSeedHelper.seedAll([
          {
            // place1:
            name: '오늘 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('4h'),
                endAt: now.after('1h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place2
            name: '내일 시간에 운영 중인 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.dayAfter(1),
                startAt: now.after('1h'),
                endAt: now.after('2h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place3
            name: '운영 정보가 없는 가게',
            activatedAt: new Date(),
          },
          {
            // place4
            name: '오늘 운영하지만 앞으로 두 시간 뒤에 운영할 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.after('2h'),
                endAt: now.after('4h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
          {
            // place5
            name: '오늘 지금 시간에 운영하되 오늘 운영 정보가 하나 더 있는 가게',
            activatedAt: new Date(),
            operatingHourList: [
              {
                day: now.day(),
                startAt: now.before('1h'),
                endAt: now.after('2h'),
              },
              {
                day: now.day(),
                startAt: now.before('2h'),
                endAt: now.before('1h'),
              },
            ],
            type: PlaceType.CAFE,
            mainCategoryList: [MainCategory.BAKERY],
          },
        ]);

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      const rouletteItemIdxSet = new Set(
        rouletteItemList.map((item) => item.idx),
      );

      expect(rouletteItemIdxSet.has(place1.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place2.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place3.idx)).toBe(false);
      expect(rouletteItemIdxSet.has(place4.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place5.idx)).toBe(true);
    });

    it('type filter check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          type: PlaceType.RESTAURANT,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          type: PlaceType.BAR,
          mainCategoryList: [MainCategory.BAKERY],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      const rouletteItemIdxSet = new Set(
        rouletteItemList.map((item) => item.idx),
      );

      expect(rouletteItemIdxSet.has(place1.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place2.idx)).toBe(false);
      expect(rouletteItemIdxSet.has(place3.idx)).toBe(false);
    });

    it('mainCategoryList filter check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY, MainCategory.DESSERT],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.ICE_CREAM],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      const rouletteItemIdxSet = new Set(
        rouletteItemList.map((item) => item.idx),
      );

      expect(rouletteItemIdxSet.has(place1.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place2.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place3.idx)).toBe(false);
    });

    it('moodCategoryList filter check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.STUDY_FRIENDLY,
          ],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.STUDY_FRIENDLY],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.SOLO_DINING],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/roulette-item')
        .query({
          type: PlaceType.CAFE,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.STUDY_FRIENDLY],
        })
        .expect(200);

      const rouletteItemList: RouletteItemEntity[] =
        response.body.rouletteItemList;

      const rouletteItemIdxSet = new Set(
        rouletteItemList.map((item) => item.idx),
      );

      expect(rouletteItemIdxSet.has(place1.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place2.idx)).toBe(true);
      expect(rouletteItemIdxSet.has(place3.idx)).toBe(false);
    });
  });
});
