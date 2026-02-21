import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';
import { BookmarkSeedHelper } from '@libs/testing/seed/bookmark/bookmark.seed';
import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { PlaceOwnerSeedHelper } from '@libs/testing/seed/place-owner/place-owner.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { SearchTagSeedHelper } from '@libs/testing/seed/search-tag/search-tag.seed';
import { GetAllPlaceOverviewResponseDto } from '@user/api/place/dto/response/get-all-place-overview-response.dto';
import { PlaceMarkerEntity } from '@user/api/place/entity/place-marker.entity';
import { PlaceOverviewEntity } from '@user/api/place/entity/place-overview.entity';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { RouletteItemEntity } from '@user/api/place/entity/roulette-item.entity';
import { PlaceService } from '@user/api/place/place.service';
import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Place E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const bookmarkSeedHelper = testHelper.seedHelper(BookmarkSeedHelper);
  const menuSeedHelper = testHelper.seedHelper(MenuSeedHelper);
  const placeOwnerSeedHelper = testHelper.seedHelper(PlaceOwnerSeedHelper);
  const searchTagSeedHelper = testHelper.seedHelper(SearchTagSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place/all', () => {
    it('200 - field check', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        type: PlaceType.CAFE,
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({ page: 1 })
        .expect(200);

      const hasNext: boolean = response.body.hasNext;
      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(hasNext).toBe(false);
      expect(Array.isArray(placeList)).toBe(true);

      const place = placeList[0];

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.bookmark).toBe(false);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.type).toBe(placeSeed.type);
      expect(place.mainCategoryList[0]).toBe(MainCategory.BAKERY);
      expect(place.mainCategoryList[1]).toBe(MainCategory.BUNGEOPPANG_WAFFLE);
      expect(place.moodCategoryList[0]).toBe(MoodCategory.STUDY_FRIENDLY);
      expect(place.moodCategoryList[1]).toBe(MoodCategory.DESSERT_HOTSPOT);
    });

    it('200 - orderby time check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 가장 먼저 생성된 장소
            name: 'first created place',
            activatedAt: new Date(),
          },
          {
            name: 'second created place',
            activatedAt: new Date(),
          },
          {
            // 가장 나중에 생성된 장소
            name: 'third created place',
            activatedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          orderby: 'time',
          order: 'asc',
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        secondPlace.idx,
        thirdPlace.idx,
      ]);
    });

    it('200 - orderby review check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 리뷰가 가장 많은 장소
            activatedAt: new Date(),
            name: 'first place with most reviews',
            reviewCount: 10,
          },
          {
            activatedAt: new Date(),
            name: 'second place with 5 reviews',
            reviewCount: 5,
          },
          {
            activatedAt: new Date(),
            name: 'third place with 8 reviews',
            reviewCount: 8,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          orderby: 'review',
          order: 'desc',
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        thirdPlace.idx,
        secondPlace.idx,
      ]);
    });

    it('200 - operating filtering check (operating === true)', async () => {
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
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(response.body.hasNext).toBe(false);
      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place5.name].sort(),
      );
    });

    it('200 - operating filtering check (operating === false)', async () => {
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
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: false,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(response.body.hasNext).toBe(false);
      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name, place4.name].sort(),
      );
    });

    it('200 - operating filtering check (operating === undefined)', async () => {
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
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      const names = placeList.map(({ name }) => name);
      expect(response.body.hasNext).toBe(false);
      expect(names.slice(0, 2).sort()).toStrictEqual(
        [place1.name, place5.name].sort(),
      );
      expect(names.slice(2).sort()).toStrictEqual(
        [place2.name, place3.name, place4.name].sort(),
      );
    });

    it('200 - operating filtering and hasNext true check (operating === undefined)', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [
        place1,
        place2,
        place3,
        place4,
        place5,
        place6,
        place7,
        place8,
        place9,
        place10,
        place11,
      ] = await placeSeedHelper.seedAll([
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
        },
        {
          // place6
          name: '6번째 가게',
          activatedAt: new Date(),
        },
        {
          // place7
          name: '7번째 가게',
          activatedAt: new Date(),
        },
        {
          // place8
          name: '8번째 가게',
          activatedAt: new Date(),
        },
        {
          // place9
          name: '9번째 가게',
          activatedAt: new Date(),
        },
        {
          // place10
          name: '10번째 가게',
          activatedAt: new Date(),
        },
        {
          // place11
          name: '11번째 가게',
          activatedAt: new Date(),
        },
      ]);

      const response1 = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
        })
        .expect(200);

      const placeList1: PlaceOverviewEntity[] =
        response1.body.placeOverviewList;

      const names1 = placeList1.map(({ name }) => name);
      expect(response1.body.hasNext).toBe(true);
      expect(names1.slice(0, 2).sort()).toStrictEqual(
        [place1.name, place5.name].sort(),
      );

      const nonOperating = [
        place2.name,
        place3.name,
        place4.name,
        place6.name,
        place7.name,
        place8.name,
        place9.name,
        place10.name,
        place11.name,
      ];
      expect(names1.slice(2)).toHaveLength(8);
      expect(nonOperating).toEqual(expect.arrayContaining(names1.slice(8)));

      const response2 = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 2,
        })
        .expect(200);

      const placeList2: PlaceOverviewEntity[] =
        response2.body.placeOverviewList;

      const names2 = placeList2.map(({ name }) => name);
      expect(response2.body.hasNext).toBe(false);
      expect(names2).toHaveLength(1);
      const remaining = nonOperating.filter(
        (n) => !names1.slice(2).includes(n),
      );
      expect(names2.sort()).toStrictEqual(remaining.sort());
    });

    it('200 - lowPrice filtering check', async () => {
      const [
        place1,
        place2,
        place3,
        place4,
        place5,
        place6,
        place7,
        place8,
        place9,
        place10,
        place11,
        place12,
      ] = await placeSeedHelper.seedAll([
        {
          // place1:
          name: '만원 이하 메뉴가 있는 가게1 + 만원 초과 메뉴도 있는 가게',
          activatedAt: new Date(),
        },
        {
          // place2
          name: '만원 이하 메뉴가 있는 가게2',
          activatedAt: new Date(),
        },
        {
          // place3
          name: '만원 이하 메뉴가 있는 가게3 + 만원 초과 메뉴도 있는 가게',
          activatedAt: new Date(),
        },
        {
          // place4
          name: '만원 이하 메뉴가 있는 가게4',
          activatedAt: new Date(),
        },
        {
          // place5
          name: '만원 이하 메뉴가 없는 가게1',
          activatedAt: new Date(),
        },
        {
          // place6
          name: '만원 이하 메뉴가 없는 가게2',
          activatedAt: new Date(),
        },
        {
          // place7
          name: '만원 이하 메뉴가 없는 가게3',
          activatedAt: new Date(),
        },
        {
          // place8
          name: '만원 이하 메뉴가 없는 가게4',
          activatedAt: new Date(),
        },
        {
          // place9
          name: '메뉴가 없는 가게1',
          activatedAt: new Date(),
        },
        {
          // place10
          name: '메뉴가 없는 가게2',
          activatedAt: new Date(),
        },
        {
          // place11
          name: '메뉴가 없는 가게3',
          activatedAt: new Date(),
        },
        {
          // place12
          name: '메뉴가 없는 가게4',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          price: 9000,
          isMain: true,
        },
        {
          placeIdx: place1.idx,
          price: 15000,
          isMain: true,
        },
        {
          placeIdx: place2.idx,
          price: 8000,
          isMain: true,
        },
        {
          placeIdx: place3.idx,
          price: 7000,
          isMain: true,
        },
        {
          placeIdx: place3.idx,
          price: 20000,
          isMain: true,
        },
        {
          placeIdx: place4.idx,
          price: 6000,
          isMain: true,
        },
        {
          placeIdx: place5.idx,
          price: 11000,
          isMain: true,
        },
        {
          placeIdx: place6.idx,
          price: 12000,
          isMain: true,
        },
        {
          placeIdx: place7.idx,
          price: 13000,
          isMain: true,
        },
        {
          placeIdx: place8.idx,
          price: 14000,
          isMain: true,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          lowPrice: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(response.body.hasNext).toBe(false);
      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place2.name, place3.name, place4.name].sort(),
      );
    });

    it('200 - lowPrice && operating === true filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [
        place1,
        place2,
        place3,
        place4,
        place5,
        place6,
        place7,
        place8,
        place9,
        place10,
        place11,
        place12,
      ] = await placeSeedHelper.seedAll([
        {
          // place1:
          name: '만원 이하 메뉴가 있는 가게1 + 만원 초과 메뉴도 있는 가게 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place2
          name: '만원 이하 메뉴가 있는 가게2 + 만원 초과 메뉴도 있는 가게',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
        {
          // place3
          name: '만원 이하 메뉴가 있는 가게3 + 만원 초과 메뉴도 있는 가게 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place4
          name: '만원 이하 메뉴가 있는 가게4',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
        {
          // place5
          name: '만원 이하 메뉴가 없는 가게1 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place6
          name: '만원 이하 메뉴가 없는 가게2 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place7
          name: '만원 이하 메뉴가 없는 가게3',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
        {
          // place8
          name: '만원 이하 메뉴가 없는 가게4',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
        {
          // place9
          name: '메뉴가 없는 가게1 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place10
          name: '메뉴가 없는 가게2 + 운영 중',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
        },
        {
          // place11
          name: '메뉴가 없는 가게3',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
        {
          // place12
          name: '메뉴가 없는 가게4',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.before('1h'),
            },
          ],
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          price: 9000,
          isMain: true,
        },
        {
          placeIdx: place1.idx,
          price: 15000,
          isMain: true,
        },
        {
          placeIdx: place2.idx,
          price: 8000,
          isMain: true,
        },
        {
          placeIdx: place2.idx,
          price: 15000,
          isMain: true,
        },
        {
          placeIdx: place3.idx,
          price: 7000,
          isMain: true,
        },
        {
          placeIdx: place3.idx,
          price: 20000,
          isMain: true,
        },
        {
          placeIdx: place4.idx,
          price: 6000,
          isMain: true,
        },
        {
          placeIdx: place5.idx,
          price: 11000,
          isMain: true,
        },
        {
          placeIdx: place6.idx,
          price: 12000,
          isMain: true,
        },
        {
          placeIdx: place7.idx,
          price: 13000,
          isMain: true,
        },
        {
          placeIdx: place8.idx,
          price: 14000,
          isMain: true,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          lowPrice: true,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(response.body.hasNext).toBe(false);
      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place3.name].sort(),
      );
    });

    it('200 - break time filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4] = await placeSeedHelper.seedAll([
        {
          // place1
          name: '1 오늘 시간에 운영 중이면서 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place2
          name: '2 오늘 시간에 운영 중이지만 휴식 정보가 없는 가게',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place3
          name: '3 오늘 시간에 운영 중이지만 휴식 시간이 다른 날에 있는 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place4
          name: '4 현재 시간에 운영 중이고 브레이크 타임이 다른 시간인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('3h'),
            },
          ],
        },
        {
          // place5
          name: '5 오늘 시간에 운영 중이고 브레이크 타임이 두 개지만 하나만 현재 시간에 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('1h'),
              endAt: now.after('2h'),
            },
            {
              day: now.day(),
              startAt: now.before('3h'),
              endAt: now.before('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('1h'),
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name, place4.name].sort(),
      );
    });

    it('200 - weekly closed date filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 원래 오늘 영업일이지만 오늘은 특별 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.new(),
              type: WeeklyCloseType.BIWEEKLY,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 원래 오늘 영업일이고 휴무는 내일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.dateAfter(1),
              type: WeeklyCloseType.BIWEEKLY,
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name].sort(),
      );
    });

    it('200 - close day filtering check', async () => {
      // ? close day: 정기 휴무일

      const now = testHelper.mockTodayTime('10:00');
      // now에 해당하는 날짜가 이번 달에 몇 번째 주인지 확인
      const nowNthOfWeek = testHelper
        .get(DateUtilService)
        .getTodayNthDayOfWeekInMonth();

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 영업중이지만, 오늘 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 영업중이지만, 내일 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.dayAfter(1),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 영업중이지만, 다음 주에 정기 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek + 1,
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          operating: true,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name].sort(),
      );
    });

    it('200 - type filtering check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 카페',
          type: PlaceType.CAFE,
        },
        {
          activatedAt: new Date(),
          name: 'place2: 음식점',
          type: PlaceType.RESTAURANT,
        },
        {
          activatedAt: new Date(),
          name: 'place3: 술집',
          type: PlaceType.BAR,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          type: PlaceType.CAFE,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    // it('200 - searchKeyword filtering check with place name(single matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: '서울 강남구 맛집',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '대전 유성구 카페',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '부산 해운대구 맛집',
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '강남구',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place1.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with place name(multiple matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: '서울 강남구 맛집',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '강남구 카페',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '부산 해운대구 맛집',
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '강남구',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place1.idx, place2.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with place name(no matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: '서울 강남구 맛집',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '대전 유성구 카페',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: '부산 해운대구 맛집',
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '홍대',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList).toHaveLength(0);
    // });

    // it('200 - searchKeyword filtering check with menu name(single matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '피자',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '치즈',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place2.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with menu name(multiple matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '치즈피자',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '치즈',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place2.idx, place3.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with menu name(no matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '피자',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '족발',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList).toHaveLength(0);
    // });

    // it('200 - searchKeyword filtering check with menu content(single matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       content: '맛있는 소고기 패티와 신선한 야채',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       content: '고소한 치즈와 육즙 가득한 패티',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '피자',
    //       content: '바삭한 도우와 풍부한 토핑',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '육즙',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place2.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with menu content(multiple matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       content: '맛있는 소고기 패티와 신선한 야채',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       content: '고소한 치즈와 육즙 가득한 패티',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '피자',
    //       content: '육즙이 풍부한 스테이크 토핑',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '육즙',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
    //     [place2.idx, place3.idx].sort(),
    //   );
    // });

    // it('200 - searchKeyword filtering check with menu content(no matched)', async () => {
    //   const [place1, place2, place3] = await placeSeedHelper.seedAll([
    //     {
    //       activatedAt: new Date(),
    //       name: 'place1',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place2',
    //     },
    //     {
    //       activatedAt: new Date(),
    //       name: 'place3',
    //     },
    //   ]);

    //   const [menu1, menu2, menu3] = await menuSeedHelper.seedAll([
    //     {
    //       placeIdx: place1.idx,
    //       name: '햄버거',
    //       content: '맛있는 소고기 패티와 신선한 야채',
    //       price: 5000,
    //     },
    //     {
    //       placeIdx: place2.idx,
    //       name: '치즈버거',
    //       content: '고소한 치즈와 육즙 가득한 패티',
    //       price: 6000,
    //     },
    //     {
    //       placeIdx: place3.idx,
    //       name: '피자',
    //       content: '바삭한 도우와 풍부한 토핑',
    //       price: 8000,
    //     },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/place/all')
    //     .query({
    //       page: 1,
    //       searchKeyword: '족발',
    //     })
    //     .expect(200);

    //   const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

    //   expect(placeList).toHaveLength(0);
    // });

    it('200 - main category filtering check (mainCategory === undefined)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx, place3.idx].sort(),
      );
    });

    it('200 - main category filtering check (single condition, multiple matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.BUNGEOPPANG_WAFFLE],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });

    it('200 - main category filtering check (multiple conditions, single matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            // MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - main category filtering check (multiple conditions, multiple matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });

    it('200 - main category filtering check (single condition, single matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.BAKERY],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - main category filtering check (single conditions, no matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.FAST_FOOD],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList).toHaveLength(0);
      expect(placeList).toEqual([]);
    });

    it('200 - main category filtering check (multiple conditions, no matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.CAFE_COFFEE, MainCategory.FAST_FOOD],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList).toHaveLength(0);
      expect(placeList).toEqual([]);
    });

    it('200 - main category & mood category filtering check(single mood condition, single matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.COST_EFFECTIVE],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - main category & mood category filtering check(single mood condition, multiple matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.BUNGEOPPANG_WAFFLE],
          moodCategoryList: [MoodCategory.SOLO_DRINKING],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });

    it('200 - main category & mood category filtering check(multiple mood conditions, single matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            // MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - main category & mood category filtering check(multiple mood conditions, multiple matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });

    it('200 - main category & mood category filtering check(single mood conditions, no matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.BUNGEOPPANG_WAFFLE,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [MainCategory.BAKERY],
          moodCategoryList: [MoodCategory.DESSERT_HOTSPOT],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList).toHaveLength(0);
      expect(placeList).toEqual([]);
    });

    it('200 - main category & mood category filtering check(multiple mood conditions, no matched)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 베이커리, 붕어빵',
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.SOLO_DRINKING,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 붕어빵, 샌드위치',
          mainCategoryList: [
            MainCategory.CAFE_COFFEE,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            MoodCategory.SOLO_DRINKING,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 샌드위치, 디저트',
          mainCategoryList: [MainCategory.SANDWICH_SALAD, MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.DESSERT_HOTSPOT,
            MoodCategory.GOOD_ATMOSPHERE,
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({
          page: 1,
          mainCategoryList: [
            MainCategory.BAKERY,
            MainCategory.BUNGEOPPANG_WAFFLE,
          ],
          moodCategoryList: [
            MoodCategory.GOOD_ATMOSPHERE,
            MoodCategory.DESSERT_HOTSPOT,
          ],
        })
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(placeList).toHaveLength(0);
      expect(placeList).toEqual([]);
    });

    it('200 - bookmark filed check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
        },
        {
          activatedAt: new Date(),
        },
        {
          activatedAt: new Date(),
        },
      ]);

      await bookmarkSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          userIdx: loginUser.idx,
        },
        {
          placeIdx: place3.idx,
          userIdx: loginUser.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(
        placeList
          .filter(({ bookmark }) => bookmark)
          .map(({ idx }) => idx)
          .sort(),
      ).toStrictEqual([place1.idx, place3.idx].sort());
    });

    it('400 - invalid page parameter', async () => {
      const invalidPage = 'invalid page parameter';

      await testHelper
        .test()
        .get('/place/all')
        .query({
          page: invalidPage,
        })
        .expect(400);
    });
  });

  // TODO: 운영 정보 필드 추가해서 테스트 해야 됨.
  describe('GET /place/marker/all', () => {
    it('200 - field check', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        typeList: [PlaceType.RESTAURANT, PlaceType.CAFE],
        mainCategoryList: [MainCategory.KOREAN, MainCategory.BAKERY],
        moodCategoryList: [
          MoodCategory.GOOD_ATMOSPHERE,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(Array.isArray(placeList)).toBe(true);

      const place = placeList[0];

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.bookmark).toBe(false);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.type).toBe(placeSeed.type);
      expect(place.mainCategoryList).toEqual(placeSeed.mainCategoryList);
      expect(place.moodCategoryList).toEqual(placeSeed.moodCategoryList);
    });

    it('200 - orderby time check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 가장 먼저 생성된 장소
            name: 'first created place',
            activatedAt: new Date(),
          },
          {
            name: 'second created place',
            activatedAt: new Date(),
          },
          {
            // 가장 나중에 생성된 장소
            name: 'third created place',
            activatedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          orderby: 'time',
          order: 'asc',
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        secondPlace.idx,
        thirdPlace.idx,
      ]);
    });

    it('200 - orderby review check', async () => {
      const [firstPlace, secondPlace, thirdPlace] =
        await placeSeedHelper.seedAll([
          {
            // 리뷰가 가장 많은 장소
            activatedAt: new Date(),
            name: 'first place with most reviews',
            reviewCount: 10,
          },
          {
            activatedAt: new Date(),
            name: 'second place with 5 reviews',
            reviewCount: 5,
          },
          {
            activatedAt: new Date(),
            name: 'third place with 8 reviews',
            reviewCount: 8,
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          orderby: 'review',
          order: 'desc',
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ idx }) => idx)).toStrictEqual([
        firstPlace.idx,
        thirdPlace.idx,
        secondPlace.idx,
      ]);
    });

    it('200 - operating filtering check', async () => {
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
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          operating: true,
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place5.name].sort(),
      );
    });

    it('200 - break time filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2, place3, place4] = await placeSeedHelper.seedAll([
        {
          // place1
          name: '1 오늘 시간에 운영 중이면서 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place2
          name: '2 오늘 시간에 운영 중이지만 휴식 정보가 없는 가게',
          activatedAt: new Date(),
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place3
          name: '3 오늘 시간에 운영 중이지만 휴식 시간이 다른 날에 있는 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('5h'),
              endAt: now.after('2h'),
            },
          ],
        },
        {
          // place4
          name: '4 현재 시간에 운영 중이고 브레이크 타임이 다른 시간인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.dayAfter(1),
              startAt: now.after('1h'),
              endAt: now.after('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('3h'),
            },
          ],
        },
        {
          // place5
          name: '5 오늘 시간에 운영 중이고 브레이크 타임이 두 개지만 하나만 현재 시간에 브레이크 타임인 가게',
          activatedAt: new Date(),
          breakTime: [
            {
              day: now.day(),
              startAt: now.before('1h'),
              endAt: now.after('2h'),
            },
            {
              day: now.day(),
              startAt: now.before('3h'),
              endAt: now.before('2h'),
            },
          ],
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('2h'),
              endAt: now.after('1h'),
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          operating: true,
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name, place4.name].sort(),
      );
    });

    it('200 - weekly closed date filtering check', async () => {
      const now = testHelper.mockTodayTime('10:00');

      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 원래 오늘 영업일이지만 오늘은 특별 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.new(),
              type: WeeklyCloseType.BIWEEKLY,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 원래 오늘 영업일이고 휴무는 내일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          weeklyClosedDayList: [
            {
              closedDate: now.dateAfter(1),
              type: WeeklyCloseType.BIWEEKLY,
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          operating: true,
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name].sort(),
      );
    });

    it('200 - close day filtering check', async () => {
      // ? close day: 정기 휴무일

      const now = testHelper.mockTodayTime('10:00');
      // now에 해당하는 날짜가 이번 달에 몇 번째 주인지 확인
      const nowNthOfWeek = testHelper
        .get(DateUtilService)
        .getTodayNthDayOfWeekInMonth();

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 영업중이지만, 오늘 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place2: 영업중이지만, 내일 정기 휴무일인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.dayAfter(1),
              week: nowNthOfWeek,
            },
          ],
        },
        {
          activatedAt: new Date(),
          name: 'place3: 영업중이지만, 다음 주에 정기 휴무인 가게',
          operatingHourList: [
            {
              day: now.day(),
              startAt: now.before('4h'),
              endAt: now.after('1h'),
            },
          ],
          closedDayList: [
            {
              day: now.day(),
              week: nowNthOfWeek + 1,
            },
          ],
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          operating: true,
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ name }) => name).sort()).toStrictEqual(
        [place2.name, place3.name].sort(),
      );
    });

    it('200 - coordinate filtering check', async () => {
      const coordinate = {
        leftTopX: 123.00001,
        leftTopY: 78.00001,
        rightBottomX: 124.99999,
        rightBottomY: 76.99999,
      };

      const [place1] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 좌표 범위 내의 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place2: y좌표 위로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.leftTopY + 0.1, // ! Y 좌표 위로 벗어남
          },
        },
        {
          activatedAt: new Date(),
          name: 'place3: x좌표 왼쪽으로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX - 0.1, // ! X 좌표 왼쪽으로 벗어남
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place4: x좌표 오른쪽으로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.rightBottomX + 0.1, // ! X 좌표 오른쪽으로 벗어남
            addressY: coordinate.rightBottomY + 0.1,
          },
        },
        {
          activatedAt: new Date(),
          name: 'place5: y좌표 아래로 벗어난 장소',
          roadAddress: {
            addressX: coordinate.leftTopX + 0.1,
            addressY: coordinate.rightBottomY - 0.1, // ! Y 좌표 아래로 벗어남
          },
        },
      ]);

      const response = await testHelper.test().get('/place/marker/all').query({
        leftTopX: coordinate.leftTopX,
        leftTopY: coordinate.leftTopY,
        rightBottomX: coordinate.rightBottomX,
        rightBottomY: coordinate.rightBottomY,
      });

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - type filtering check', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          activatedAt: new Date(),
          name: 'place1: 카페',
          type: PlaceType.CAFE,
        },
        {
          activatedAt: new Date(),
          name: 'place2: 음식점',
          type: PlaceType.RESTAURANT,
        },
        {
          activatedAt: new Date(),
          name: 'place3: 술집',
          type: PlaceType.BAR,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          type: PlaceType.CAFE,
        })
        .expect(200);

      const placeList: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(placeList.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering single place name', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'place 1',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx)).toStrictEqual([place1.idx]);
    });

    it('200 - check searchKeyword filtering multiple place name', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'place',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      console.log(places);

      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx, place3.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering (do not exist place name)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'not exist',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places).toStrictEqual([]);
    });

    it('200 - check searchKeyword filtering single menu name', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'menu 1',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx)).toStrictEqual([place1.idx]);
    });

    it('200 - check searchKeyword filtering multiple menu name', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'menu',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx, place3.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering (do not exist menu name)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'not exist',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places).toStrictEqual([]);
    });

    it('200 - check searchKeyword filtering single menu content', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'content 1',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx)).toStrictEqual([place1.idx]);
    });

    it('200 - check searchKeyword filtering multiple menu content', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'content',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx, place3.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering (do not exist menu content)', async () => {
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'not exist',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places).toStrictEqual([]);
    });

    it('200 - check searchKeyword filtering single search tag content', async () => {
      const [searchTag1, searchTag2, searchTag3, searchTag4] =
        await searchTagSeedHelper.seedAll([
          { content: 'search tag 1' },
          { content: 'search tag 2' },
          { content: 'search tag 3' },
          { content: 'search tag 4' },
        ]);

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag1.idx, searchTag2.idx],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag3.idx],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag4.idx],
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'search tag 3',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx)).toStrictEqual([place2.idx]);
    });

    it('200 - check searchKeyword filtering multiple search tag content', async () => {
      const [searchTag1, searchTag2, searchTag3, searchTag4] =
        await searchTagSeedHelper.seedAll([
          { content: 'search tag 1' },
          { content: 'search tag 2' },
          { content: 'search tag 3' },
          { content: 'search tag 4' },
        ]);

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag1.idx, searchTag2.idx],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag2.idx, searchTag3.idx],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag3.idx, searchTag4.idx],
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'search tag 2',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering multiple search tag prefix content', async () => {
      const [searchTag1, searchTag2, searchTag3, searchTag4] =
        await searchTagSeedHelper.seedAll([
          { content: 'search tag 1' },
          { content: 'search tag 2' },
          { content: 'search tag 3' },
          { content: 'search tag 4' },
        ]);

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag1.idx, searchTag2.idx],
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag2.idx, searchTag3.idx],
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          searchTagIdxList: [searchTag3.idx, searchTag4.idx],
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'search',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx, place3.idx].sort(),
      );
    });

    it('200 - check searchKeyword filtering (do not exist menu content)', async () => {
      const [searchTag1, searchTag2, searchTag3, searchTag4] =
        await searchTagSeedHelper.seedAll([
          { content: 'search tag 1' },
          { content: 'search tag 2' },
          { content: 'search tag 3' },
          { content: 'search tag 4' },
        ]);

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      await menuSeedHelper.seedAll([
        {
          placeIdx: place1.idx,
          name: 'menu 1',
          content: 'content 1',
        },
        {
          placeIdx: place2.idx,
          name: 'menu 2',
          content: 'content 2',
        },
        {
          placeIdx: place3.idx,
          name: 'menu 3',
          content: 'content 3',
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place/marker/all')
        .query({
          searchKeyword: 'not exist',
        })
        .expect(200);

      const places: PlaceMarkerEntity[] = response.body.placeMarkerList;

      expect(places).toStrictEqual([]);
    });
  });

  describe('GET /place/bookmarked/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      await bookmarkSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const hasNext: boolean = response.body.hasNext;
      const placeList: PlaceOverviewEntity[] = response.body.placeOverviewList;

      expect(hasNext).toBe(false);
      expect(Array.isArray(placeList)).toBe(true);

      const place = placeList[0];

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.bookmark).toBe(true);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.mainCategoryList[0]).toBe(MainCategory.BAKERY);
      expect(place.mainCategoryList[1]).toBe(MainCategory.BUNGEOPPANG_WAFFLE);
      expect(place.moodCategoryList[0]).toBe(MoodCategory.STUDY_FRIENDLY);
      expect(place.moodCategoryList[1]).toBe(MoodCategory.DESSERT_HOTSPOT);
    });

    it('400 - invalid querystring', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidPage = 'invalid page parameter';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: invalidPage })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('400 - invalid order parameter', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const invalidOrder = 'invalid order parameter';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({
          page: 1,
          order: invalidOrder,
        })
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(400);
    });

    it('401 - invalid access token', async () => {
      const invalidToken = 'invalid-access-token';

      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });

    it('401 - no token provided', async () => {
      await testHelper
        .test()
        .get('/place/bookmarked/all')
        .query({ page: 1 })
        .expect(401);
    });
  });

  describe('GET /place/:placeIdx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const now = testHelper.mockTodayTime('10:00');

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        name: 'Test Place',
        tel: '032-1111-2222',
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        type: PlaceType.CAFE,
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        bookmarkCount: 1,
        isClosedOnHoliday: false,
        deletedAt: null,
        permanentlyClosedAt: null,
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        breakTime: [
          {
            day: DayOfWeek.THU,
            startAt: now.new('12:00'),
            endAt: now.new('13:00'),
          },
          {
            day: DayOfWeek.THU,
            startAt: now.new('20:00'),
            endAt: now.new('21:00'),
          },
        ],
        operatingHourList: [
          {
            day: DayOfWeek.FRI,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
          {
            day: DayOfWeek.SAT,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
        ],
        weeklyClosedDayList: [
          {
            closedDate: now.new(),
            type: WeeklyCloseType.BIWEEKLY,
          },
          {
            closedDate: now.dateAfter(1),
            type: WeeklyCloseType.BIWEEKLY,
          },
        ],
        closedDayList: [
          {
            day: DayOfWeek.FRI,
            week: 1,
          },
          {
            day: DayOfWeek.SAT,
            week: 2,
          },
        ],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([2, 1]);
      expect(place.bookmark).toBe(false);
      expect(place.imagePathList.sort()).toEqual(placeSeed.placeImgList.sort());
      expect(place.isClosedOnHoliday).toBe(placeSeed.isClosedOnHoliday);
      expect(place.type).toBe(placeSeed.type);
      expect(place.breakTimeList.length).toBe(2);
      expect(place.breakTimeList[0].startAt).toBe('12:00:00');
      expect(place.breakTimeList[0].endAt).toBe('13:00:00');
      expect(place.breakTimeList[1].startAt).toBe('20:00:00');
      expect(place.breakTimeList[1].endAt).toBe('21:00:00');
      expect(place.operatingHourList.length).toBe(2);
      expect(place.operatingHourList[0].startAt).toBe('10:00:00');
      expect(place.operatingHourList[0].endAt).toBe('20:00:00');
      expect(place.operatingHourList[1].startAt).toBe('10:00:00');
      expect(place.operatingHourList[1].endAt).toBe('20:00:00');
      expect(place.weeklyClosedDayList.length).toBe(2);
      expect(place.weeklyClosedDayList[0].date).toBe(
        now.new().toISOString().split('T')[0],
      );
      expect(place.weeklyClosedDayList[0].type).toBe(WeeklyCloseType.BIWEEKLY);
      expect(place.weeklyClosedDayList[1].date).toBe(
        now.dateAfter(1).toISOString().split('T')[0],
      );
      expect(place.weeklyClosedDayList[1].type).toBe(WeeklyCloseType.BIWEEKLY);
      expect(place.closedDayList.length).toBe(2);
      expect(place.closedDayList[0].day).toBe(DayOfWeek.FRI);
      expect(place.closedDayList[0].week).toBe(1);
      expect(place.closedDayList[1].day).toBe(DayOfWeek.SAT);
      expect(place.closedDayList[1].week).toBe(2);
      expect(place.mainCategoryList[0]).toBe(MainCategory.BAKERY);
      expect(place.mainCategoryList[1]).toBe(MainCategory.BUNGEOPPANG_WAFFLE);
      expect(place.moodCategoryList[0]).toBe(MoodCategory.STUDY_FRIENDLY);
      expect(place.moodCategoryList[1]).toBe(MoodCategory.DESSERT_HOTSPOT);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('404 - deleted place', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      const place = await testHelper.getPrisma().place.findUnique({
        where: { idx: placeSeed.idx },
      });
      console.log(place);

      await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('404 - not activated place', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const nonExistentPlaceIdx = 9999;

      await testHelper
        .test()
        .get(`/place/${nonExistentPlaceIdx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(404);
    });

    it('200 - no token provided', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper.test().get(`/place/${placeSeed.idx}`).expect(200);
    });

    it('200 - bookmark field check', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await bookmarkSeedHelper.seed({
        placeIdx: placeSeed.idx,
        userIdx: loginUser.idx,
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.bookmark).toBe(true);
    });
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
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
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

      const placeService = testHelper.get(PlaceService);
      (placeService as any).TARGET_PLACE_IDX_LIST = targetPlaceIdxList;
      (placeService as any).MULTIPLIER = multiplier;

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
          mainCategoryList: [MainCategory.ICE_CREAM_BINGSU],
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

  describe('GET /owner/place/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const now = testHelper.mockTodayTime('10:00');

      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        name: 'Test Place',
        tel: '032-1111-2222',
        roadAddress: {
          name: 'Test Road',
          detail: 'Test Detail',
          addressX: 123.456,
          addressY: 78.91,
        },
        type: PlaceType.CAFE,
        reviewCount: 5,
        placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
        bookmarkCount: 1,
        isClosedOnHoliday: false,
        deletedAt: null,
        permanentlyClosedAt: null,
        keywordCountList: [
          {
            keywordIdx: 1,
            count: 10,
          },
          {
            keywordIdx: 2,
            count: 12,
          },
          {
            keywordIdx: 3,
            count: 8,
          },
        ],
        breakTime: [
          {
            day: DayOfWeek.THU,
            startAt: now.new('12:00'),
            endAt: now.new('13:00'),
          },
          {
            day: DayOfWeek.THU,
            startAt: now.new('20:00'),
            endAt: now.new('21:00'),
          },
        ],
        operatingHourList: [
          {
            day: DayOfWeek.FRI,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
          {
            day: DayOfWeek.SAT,
            startAt: now.new('10:00'),
            endAt: now.new('20:00'),
          },
        ],
        weeklyClosedDayList: [
          {
            closedDate: now.new(),
            type: WeeklyCloseType.BIWEEKLY,
          },
          {
            closedDate: now.dateAfter(1),
            type: WeeklyCloseType.BIWEEKLY,
          },
        ],
        closedDayList: [
          {
            day: DayOfWeek.FRI,
            week: 1,
          },
          {
            day: DayOfWeek.SAT,
            week: 2,
          },
        ],
      });

      const placeOwner = await placeOwnerSeedHelper.seed({
        userIdx: loginUser.idx,
        placeIdx: placeSeed.idx,
      });

      const response = await testHelper
        .test()
        .get(`/owner/place/all`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const places: PlaceEntity[] = response.body;

      expect(places[0].idx).toBe(placeSeed.idx);
      expect(places[0].name).toBe(placeSeed.name);
      expect(places[0].roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(places[0].roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(places[0].roadAddress.addressX).toBe(
        placeSeed.roadAddress.addressX,
      );
      expect(places[0].roadAddress.addressY).toBe(
        placeSeed.roadAddress.addressY,
      );
      expect(places[0].reviewCount).toBe(placeSeed.reviewCount);
      expect(places[0].topKeywordList.map(({ idx }) => idx)).toStrictEqual([
        2, 1,
      ]);
      expect(places[0].bookmark).toBe(false);
      expect(places[0].imagePathList.sort()).toEqual(
        placeSeed.placeImgList.sort(),
      );
      expect(places[0].isClosedOnHoliday).toBe(placeSeed.isClosedOnHoliday);
      expect(places[0].type).toBe(placeSeed.type);
      expect(places[0].breakTimeList.length).toBe(2);
      expect(places[0].breakTimeList[0].startAt).toBe('12:00:00');
      expect(places[0].breakTimeList[0].endAt).toBe('13:00:00');
      expect(places[0].breakTimeList[1].startAt).toBe('20:00:00');
      expect(places[0].breakTimeList[1].endAt).toBe('21:00:00');
      expect(places[0].operatingHourList.length).toBe(2);
      expect(places[0].operatingHourList[0].startAt).toBe('10:00:00');
      expect(places[0].operatingHourList[0].endAt).toBe('20:00:00');
      expect(places[0].operatingHourList[1].startAt).toBe('10:00:00');
      expect(places[0].operatingHourList[1].endAt).toBe('20:00:00');
      expect(places[0].weeklyClosedDayList.length).toBe(2);
      expect(places[0].weeklyClosedDayList[0].date).toBe(
        now.new().toISOString().split('T')[0],
      );
      expect(places[0].weeklyClosedDayList[0].type).toBe(
        WeeklyCloseType.BIWEEKLY,
      );
      expect(places[0].weeklyClosedDayList[1].date).toBe(
        now.dateAfter(1).toISOString().split('T')[0],
      );
      expect(places[0].weeklyClosedDayList[1].type).toBe(
        WeeklyCloseType.BIWEEKLY,
      );
      expect(places[0].closedDayList.length).toBe(2);
      expect(places[0].closedDayList[0].day).toBe(DayOfWeek.FRI);
      expect(places[0].closedDayList[0].week).toBe(1);
      expect(places[0].closedDayList[1].day).toBe(DayOfWeek.SAT);
      expect(places[0].closedDayList[1].week).toBe(2);
    });

    it('200 - no place owned by user', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const response = await testHelper
        .test()
        .get(`/owner/place/all`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const places: PlaceEntity[] = response.body;

      expect(places).toStrictEqual([]);
    });

    it('200 - do not get places of which user is not the owner', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const anotherUser = testHelper.loginUsers.user2;

      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          name: 'Test Place',
          activatedAt: new Date(),
        },
        {
          name: 'Another Place',
          activatedAt: new Date(),
        },
      ]);

      await placeOwnerSeedHelper.seedAll([
        {
          userIdx: anotherUser.idx,
          placeIdx: place1.idx,
        },
        {
          userIdx: loginUser.idx,
          placeIdx: place2.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get(`/owner/place/all`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const places: PlaceEntity[] = response.body;

      expect(places.length).toBe(1);
      expect(places[0].idx).toBe(place2.idx);
    });

    it('200 - get multiple places owned by user', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          name: 'Test Place',
          activatedAt: new Date(),
        },
        {
          name: 'Another Place',
          activatedAt: new Date(),
        },
      ]);

      await placeOwnerSeedHelper.seedAll([
        {
          userIdx: loginUser.idx,
          placeIdx: place1.idx,
        },
        {
          userIdx: loginUser.idx,
          placeIdx: place2.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get(`/owner/place/all`)
        .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
        .expect(200);

      const places: PlaceEntity[] = response.body;

      expect(places.length).toBe(2);
      expect(places.map(({ idx }) => idx).sort()).toStrictEqual(
        [place1.idx, place2.idx].sort(),
      );
    });
  });
});
