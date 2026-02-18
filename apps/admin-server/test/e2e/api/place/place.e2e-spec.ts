import { AdminServerModule } from '@admin/admin-server.module';
import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { GetPlaceOverviewDto } from '@admin/api/place/dto/request/get-place-overview-all.dto';
import { UpdatePlaceFreeTagDto } from '@admin/api/place/dto/request/update-place-free-tag.dto';
import { UpdatePlaceDto } from '@admin/api/place/dto/request/update-place.dto';
import { RunBiWeeklyClosedDayCronJobResponseDto } from '@admin/api/place/dto/response/run-bi-weekly-closed-day-cron-job.response.dto';
import { PlaceOverviewEntity } from '@admin/api/place/entity/place-overview.entity';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { DayOfWeek } from '@libs/common/modules/date-util/constants/day-of-week.constants';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { KakaoAddressService } from '@libs/modules/kakao-address/kakao-address.service';
import { FreeTagSeedHelper } from '@libs/testing/seed/free-tag/free-tag.seed';
import { MenuSeedHelper } from '@libs/testing/seed/menu/menu.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';

describe('Place E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const menuSeedHelper = testHelper.seedHelper(MenuSeedHelper);
  const freeTagSeedHelper = testHelper.seedHelper(FreeTagSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place', () => {
    it('200 - field check', async () => {
      const dto: GetPlaceOverviewDto = {
        page: 1,
      };

      const loginUser = testHelper.loginAdmin.admin1;

      const placeSeed = await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const place: PlaceOverviewEntity = response.body.placeList[0];
      const count: number = response.body.count;

      expect(count).toBe(1);

      expect(place.idx).toBe(placeSeed.idx);
      expect(place.name).toBe(placeSeed.name);
      expect(place.roadAddress.name).toBe(placeSeed.roadAddress.name);
      expect(place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
      expect(place.roadAddress.addressX).toBe(placeSeed.roadAddress.addressX);
      expect(place.roadAddress.addressY).toBe(placeSeed.roadAddress.addressY);
      expect(place.reviewCount).toBe(placeSeed.reviewCount);
      expect(place.type).toBe(placeSeed.type);
      expect(place.activatedAt).toBe(placeSeed.activatedAt);
      expect(place.mainCategoryList).toEqual([]);
      expect(place.moodCategoryList).toEqual([]);
      expect(place.freeTagList).toEqual([]);
    });

    it('401 - no access token provided', async () => {
      const dto: GetPlaceOverviewDto = {
        page: 1,
      };

      await testHelper.test().get('/place').query(dto).expect(401);
    });

    it('400 - invalid page', async () => {
      const dto = {
        page: 'invalid page',
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(400);
    });

    it('400 - page must be at least 1', async () => {
      const dto = {
        page: 0,
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(400);
    });

    it('200 - check active filtering', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        active: true,
      };

      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
        },
        {
          name: 'place 2',
          activatedAt: null,
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [place3.name, place1.name].sort(),
      );
      expect(count).toBe(2);
    });

    it('200 - check searchKeyword filtering single place name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'place 1',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name)).toStrictEqual([place1.name]);
      expect(count).toBe(1);
    });

    it('200 - check searchKeyword filtering multiple place name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'place',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place2.name, place3.name].sort(),
      );
      expect(count).toBe(3);
    });

    it('200 - check searchKeyword filtering (do not exist place name)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'not exist',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places).toStrictEqual([]);
      expect(count).toBe(0);
    });

    it('200 - check searchKeyword filtering single menu name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'menu 1',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name)).toStrictEqual([place1.name]);
      expect(count).toBe(1);
    });

    it('200 - check searchKeyword filtering multiple menu name', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'menu',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place2.name, place3.name].sort(),
      );
      expect(count).toBe(3);
    });

    it('200 - check searchKeyword filtering (do not exist menu name)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'not exist',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places).toStrictEqual([]);
      expect(count).toBe(0);
    });

    it('200 - check searchKeyword filtering single menu content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'content 1',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name)).toStrictEqual([place1.name]);
      expect(count).toBe(1);
    });

    it('200 - check searchKeyword filtering multiple menu content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'content',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place2.name, place3.name].sort(),
      );
      expect(count).toBe(3);
    });

    it('200 - check searchKeyword filtering (do not exist menu content)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        search: 'not exist',
      };

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
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places).toStrictEqual([]);
      expect(count).toBe(0);
    });

    it('200 - check type filtering', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetPlaceOverviewDto = {
        page: 1,
        type: PlaceType.CAFE,
      };

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
        place13,
        place14,
      ] = await placeSeedHelper.seedAll([
        {
          name: 'place 1',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 2',
          activatedAt: new Date(),
          type: PlaceType.RESTAURANT,
        },
        {
          name: 'place 3',
          activatedAt: new Date(),
          type: PlaceType.BAR,
        },
        {
          name: 'place 4',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 5',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 6',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 7',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 8',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 9',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 10',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 11',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 12',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 13',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
        {
          name: 'place 14',
          activatedAt: new Date(),
          type: PlaceType.CAFE,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const places: PlaceOverviewEntity[] = response.body.placeList;
      const count: number = response.body.count;

      expect(places.map(({ name }) => name).sort()).toStrictEqual(
        [
          place5.name,
          place6.name,
          place7.name,
          place8.name,
          place9.name,
          place10.name,
          place11.name,
          place12.name,
          place13.name,
          place14.name,
        ].sort(),
      );
      expect(count).toBe(12);

      const dto2: GetPlaceOverviewDto = {
        page: 2,
        type: PlaceType.CAFE,
      };

      const response2 = await testHelper
        .test()
        .get('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto2)
        .expect(200);

      const places2: PlaceOverviewEntity[] = response2.body.placeList;
      const count2: number = response2.body.count;

      expect(places2.map(({ name }) => name).sort()).toStrictEqual(
        [place1.name, place4.name].sort(),
      );
      expect(count2).toBe(12);
    });
  });

  describe('GET /place/:idx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const now = testHelper.mockTodayTime('10:00');

      const [freeTag1, freeTag2] = await freeTagSeedHelper.seedAll([
        {
          content: 'free tag 1',
        },
        {
          content: 'free tag 2',
        },
      ]);

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
        freeTagContentList: [freeTag1.idx, freeTag2.idx],
      });

      const response = await testHelper
        .test()
        .get(`/place/${placeSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
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
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
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
      expect(place.freeTagList.map(({ idx }) => idx).sort()).toEqual(
        [freeTag1.idx, freeTag2.idx].sort(),
      );
    });

    it('200 - not activated place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: null,
        deletedAt: null,
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('404 - deleted place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      await testHelper
        .test()
        .get(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('401 - no token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: null,
      });

      await testHelper.test().get(`/place/${place.idx}`).expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .get(`/place/${invalidPlaceIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });
  });

  describe('POST /place', () => {
    it('200 - field check', async () => {
      const kakao = testHelper.get<KakaoAddressService>(KakaoAddressService);
      const mock = jest.spyOn(kakao, 'searchAddress').mockResolvedValue({
        documents: [{ x: '127.1111', y: '37.5665' }],
      } as any);

      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [
          { day: DayOfWeek.MON, week: 1 },
          { day: DayOfWeek.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: DayOfWeek.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: DayOfWeek.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: DayOfWeek.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: DayOfWeek.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WeeklyCloseType.BIWEEKLY },
          { date: '2025-07-23', type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .post('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(200);

      const place: PlaceEntity = response.body;

      expect(place.name).toBe(createPlaceDto.name);
      expect(place.roadAddress.name).toBe(createPlaceDto.roadAddress.name);
      expect(place.roadAddress.detail).toBe(createPlaceDto.roadAddress.detail);
      expect(place.imagePathList.sort()).toEqual(place.imagePathList.sort());
      expect(place.isClosedOnHoliday).toBe(createPlaceDto.isClosedOnHoliday);
      expect(place.type).toBe(createPlaceDto.type);
      expect(place.breakTimeList.length).toBe(2);
      expect(place.breakTimeList[0].startAt).toBe('12:00:00');
      expect(place.breakTimeList[0].endAt).toBe('13:00:00');
      expect(place.breakTimeList[0].day).toBe(DayOfWeek.WED);
      expect(place.breakTimeList[1].startAt).toBe('14:00:00');
      expect(place.breakTimeList[1].endAt).toBe('15:00:00');
      expect(place.breakTimeList[1].day).toBe(DayOfWeek.FRI);
      expect(place.operatingHourList.length).toBe(2);
      expect(place.operatingHourList[0].startAt).toBe('10:00:00');
      expect(place.operatingHourList[0].endAt).toBe('20:00:00');
      expect(place.operatingHourList[0].day).toBe(DayOfWeek.THU);
      expect(place.operatingHourList[1].startAt).toBe('11:00:00');
      expect(place.operatingHourList[1].endAt).toBe('21:00:00');
      expect(place.operatingHourList[1].day).toBe(DayOfWeek.SAT);
      expect(place.weeklyClosedDayList.length).toBe(2);
      expect(place.weeklyClosedDayList[0].date).toBe(
        createPlaceDto.weeklyClosedDayList[0].date,
      );
      expect(place.weeklyClosedDayList[0].type).toBe(
        createPlaceDto.weeklyClosedDayList[0].type,
      );
      expect(place.weeklyClosedDayList[1].date).toBe(
        createPlaceDto.weeklyClosedDayList[1].date,
      );
      expect(place.weeklyClosedDayList[1].type).toBe(
        createPlaceDto.weeklyClosedDayList[1].type,
      );
      expect(place.closedDayList.length).toBe(2);
      expect(place.closedDayList[0].day).toBe(DayOfWeek.MON);
      expect(place.closedDayList[0].week).toBe(1);
      expect(place.closedDayList[1].day).toBe(DayOfWeek.TUE);
      expect(place.closedDayList[1].week).toBe(2);
      expect(place.mainCategoryList).toEqual([]);
      expect(place.moodCategoryList).toEqual([]);
      expect(place.freeTagList).toEqual([]);

      mock.mockRestore();
    });

    it('401 - no access token', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [
          { day: DayOfWeek.MON, week: 1 },
          { day: DayOfWeek.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: DayOfWeek.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: DayOfWeek.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: DayOfWeek.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: DayOfWeek.SAT },
        ],
        weeklyClosedDayList: [
          { date: '2025-07-22', type: WeeklyCloseType.BIWEEKLY },
          { date: '2025-07-23', type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      await testHelper.test().post('/place').send(createPlaceDto).expect(401);
    });

    it('401 - ensures invalid times are rejected by IsKoreanTime decorator', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [],
        breakTimeList: [
          { startAt: '12:00:00.00z', endAt: '13:00:00', day: DayOfWeek.WED },
        ],
        operatingHourList: [],
        weeklyClosedDayList: [],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(400);
    });

    it('400 - ensures invalid date are rejected by IsKoreanDate decorator', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'New Place',
        tel: '032-1234-5678',
        isClosedOnHoliday: false,
        imagePathList: ['/place/image1.png', '/place/image2.png'],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'New Road',
          detail: 'New Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [],
        breakTimeList: [],
        operatingHourList: [],
        weeklyClosedDayList: [
          { date: '2025/07/01', type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createPlaceDto)
        .expect(400);
    });
  });

  describe('PUT /place/:idx/category', () => {
    it('200 - successfully updates single main category and no mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(1);
      expect(afterMainCategoryList[0].mainCategoryIdx).toBe(
        MainCategory.DESSERT,
      );
      expect(afterMoodCategoryList.length).toBe(0);
    });

    it('200 - successfully updates no main category and single mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(0);
      expect(afterMoodCategoryList.length).toBe(1);
      expect(afterMoodCategoryList[0].moodCategoryIdx).toBe(
        MoodCategory.GOOD_ATMOSPHERE,
      );
    });

    it('200 - successfully updates multiple main category and single mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(2);
      expect(
        afterMainCategoryList
          .map((category) => category.mainCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD].sort(),
      );
      expect(afterMoodCategoryList.length).toBe(1);
      expect(afterMoodCategoryList[0].moodCategoryIdx).toBe(
        MoodCategory.GOOD_ATMOSPHERE,
      );
    });

    it('200 successfully updates single main category and multiple mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [
            MoodCategory.GOOD_ATMOSPHERE,
            MoodCategory.COST_EFFECTIVE,
          ],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(1);
      expect(afterMainCategoryList[0].mainCategoryIdx).toBe(
        MainCategory.DESSERT,
      );
      expect(afterMoodCategoryList.length).toBe(2);
      expect(
        afterMoodCategoryList
          .map((category) => category.moodCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MoodCategory.GOOD_ATMOSPHERE, MoodCategory.COST_EFFECTIVE].sort(),
      );
    });

    it('200 - successfully updates multiple main category and no mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(2);
      expect(
        afterMainCategoryList
          .map((category) => category.mainCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD].sort(),
      );
      expect(afterMoodCategoryList.length).toBe(0);
    });

    it('200 - successfully updates no main category and multiple mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [],
          moodCategoryList: [
            MoodCategory.GOOD_ATMOSPHERE,
            MoodCategory.COST_EFFECTIVE,
          ],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(0);
      expect(afterMoodCategoryList.length).toBe(2);
      expect(
        afterMoodCategoryList
          .map((category) => category.moodCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MoodCategory.GOOD_ATMOSPHERE, MoodCategory.COST_EFFECTIVE].sort(),
      );
    });

    it('200 - successfully updates duplicate category is ignored and unique categories are added to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [
            MainCategory.DESSERT,
            MainCategory.DESSERT,
            MainCategory.SANDWICH_SALAD,
          ],
          moodCategoryList: [
            MoodCategory.GOOD_ATMOSPHERE,
            MoodCategory.COST_EFFECTIVE,
            MoodCategory.COST_EFFECTIVE,
          ],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(2);
      expect(
        afterMainCategoryList
          .map((category) => category.mainCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD].sort(),
      );
      expect(afterMoodCategoryList.length).toBe(2);
      expect(
        afterMoodCategoryList
          .map((category) => category.moodCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MoodCategory.GOOD_ATMOSPHERE, MoodCategory.COST_EFFECTIVE].sort(),
      );
    });

    it('200 - successfully updates multiple types, main category and mood category to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
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

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const beforeMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const beforeMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE, PlaceType.RESTAURANT],
          mainCategoryList: [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD],
          moodCategoryList: [
            MoodCategory.GOOD_ATMOSPHERE,
            MoodCategory.COST_EFFECTIVE,
          ],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMapping.findMany({
        where: { placeIdx: place.idx },
      });
      const afterMainCategoryList =
        await prisma.placeMainCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });
      const afterMoodCategoryList =
        await prisma.placeMoodCategoryMapping.findMany({
          where: { placeIdx: place.idx },
        });

      expect(afterTypeList.length).toBe(2);
      expect(
        afterTypeList.map((type) => type.placeTypeIdx).sort(),
      ).toStrictEqual([PlaceType.CAFE, PlaceType.RESTAURANT].sort());
      expect(afterMainCategoryList.length).toBe(2);
      expect(
        afterMainCategoryList
          .map((category) => category.mainCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD].sort(),
      );
      expect(afterMoodCategoryList.length).toBe(2);
      expect(
        afterMoodCategoryList
          .map((category) => category.moodCategoryIdx)
          .sort(),
      ).toStrictEqual(
        [MoodCategory.GOOD_ATMOSPHERE, MoodCategory.COST_EFFECTIVE].sort(),
      );
    });

    it('401 - no access token', async () => {
      const place = await placeSeedHelper.seed({
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

      await testHelper
        .test()
        .put(`/place/${place.idx}/category`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .put(`/place/${invalidPlaceIdx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(400);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = 99999;

      await testHelper
        .test()
        .put(`/place/${nonExistentPlaceIdx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(404);
    });
  });

  describe('PUT /place/:idx/free-tag', () => {
    it('200 - successfully updates free tag list to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const [freeTag1, freeTag2] = await freeTagSeedHelper.seedAll([
        {
          content: 'Free Tag 1',
        },
        {
          content: 'Free Tag 2',
        },
      ]);
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const updatePlaceFreeTagDto: UpdatePlaceFreeTagDto = {
        freeTagList: [freeTag1.content, freeTag2.content],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceFreeTagDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.freeTagList.length).toBe(2);
      expect(placeModel.freeTagList.map(({ idx }) => idx).sort()).toEqual(
        [freeTag1.idx, freeTag2.idx].sort(),
      );
    });

    it('200 - successfully updates empty free tag list to place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const updatePlaceFreeTagDto: UpdatePlaceFreeTagDto = {
        freeTagList: [],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceFreeTagDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.freeTagList.length).toBe(0);
    });

    it('200 - successfully updated place free tags when none of the tags previously existed', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();

      const newFreeTags = ['New Free Tag 1', 'New Free Tag 2'];
      const existingFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(existingFreeTags.length).toBe(0);

      const updatePlaceFreeTagDto: UpdatePlaceFreeTagDto = {
        freeTagList: newFreeTags,
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceFreeTagDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.freeTagList.length).toBe(2);
      expect(
        placeModel.freeTagList.map(({ content }) => content).sort(),
      ).toEqual(newFreeTags.sort());

      const createdFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(createdFreeTags.length).toBe(2);
      expect(createdFreeTags.map(({ content }) => content).sort()).toEqual(
        newFreeTags.sort(),
      );
    });

    it('200 - successfully updates place free tags when some of the tags previously existed and some are new', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();

      const [freeTag1, freeTag2] = await freeTagSeedHelper.seedAll([
        {
          content: 'Existing Free Tag 1',
        },
        {
          content: 'Existing Free Tag 2',
        },
      ]);

      const newFreeTags = ['Existing Free Tag 1', 'New Free Tag 1'];
      const existingFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(existingFreeTags.length).toBe(1);
      expect(existingFreeTags[0].content).toBe('Existing Free Tag 1');

      const updatePlaceFreeTagDto: UpdatePlaceFreeTagDto = {
        freeTagList: newFreeTags,
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceFreeTagDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.freeTagList.length).toBe(2);
      expect(
        placeModel.freeTagList.map(({ content }) => content).sort(),
      ).toEqual(newFreeTags.sort());

      const createdFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(createdFreeTags.length).toBe(2);
      expect(createdFreeTags.map(({ content }) => content).sort()).toEqual(
        newFreeTags.sort(),
      );
    });

    it('200 - successfully updates place free tags when all of the tags previously existed', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();

      const [freeTag1, freeTag2] = await freeTagSeedHelper.seedAll([
        {
          content: 'Existing Free Tag 1',
        },
        {
          content: 'Existing Free Tag 2',
        },
      ]);

      const newFreeTags = ['Existing Free Tag 1', 'Existing Free Tag 2'];
      const existingFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(existingFreeTags.length).toBe(2);
      expect(existingFreeTags.map(({ content }) => content).sort()).toEqual(
        newFreeTags.sort(),
      );

      const updatePlaceFreeTagDto: UpdatePlaceFreeTagDto = {
        freeTagList: newFreeTags,
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceFreeTagDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.freeTagList.length).toBe(2);
      expect(
        placeModel.freeTagList.map(({ content }) => content).sort(),
      ).toEqual(newFreeTags.sort());

      const createdFreeTags = await prisma.freeTag.findMany({
        where: {
          content: {
            in: newFreeTags,
          },
        },
      });
      expect(createdFreeTags.length).toBe(2);
      expect(createdFreeTags.map(({ content }) => content).sort()).toEqual(
        newFreeTags.sort(),
      );
    });

    it('401 - no access token', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .put(`/place/${place.idx}/free-tag`)
        .send({
          freeTagList: ['Free Tag 1', 'Free Tag 2'],
        })
        .expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .put(`/place/${invalidPlaceIdx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          freeTagList: ['Free Tag 1', 'Free Tag 2'],
        })
        .expect(400);
    });

    it('404 - place not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = 99999;

      await testHelper
        .test()
        .put(`/place/${nonExistentPlaceIdx}/free-tag`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          freeTagList: ['Free Tag 1', 'Free Tag 2'],
        })
        .expect(404);
    });
  });

  describe('PUT /place/:idx', () => {
    it('200 - confirms fields are updated successfully', async () => {
      const kakao = testHelper.get<KakaoAddressService>(KakaoAddressService);
      const mock = jest.spyOn(kakao, 'searchAddress').mockResolvedValue({
        documents: [{ x: '127.1111', y: '37.5665' }],
      } as any);

      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        // 테스트를 위해 과거 날짜로 격주 휴무일 생성
        weeklyClosedDayList: [
          {
            closedDate: new Date('2025-08-20T00:00:00Z'),
            type: WeeklyCloseType.BIWEEKLY,
          },
        ],
      });

      function getKstDateString(offsetDays = 0): string {
        const now = new Date();
        // 한국시간 보정 (+9시간)
        now.setHours(now.getHours() + 9);
        now.setDate(now.getDate() + offsetDays);

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [
          { day: DayOfWeek.MON, week: 1 },
          { day: DayOfWeek.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: DayOfWeek.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: DayOfWeek.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: DayOfWeek.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: DayOfWeek.SAT },
        ],
        weeklyClosedDayList: [
          { date: getKstDateString(), type: WeeklyCloseType.BIWEEKLY },
          { date: getKstDateString(1), type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceDto)
        .expect(200);

      const placeModel = await testHelper
        .get(PlaceCoreService)
        .getPlaceByIdx(place.idx);

      if (!placeModel) {
        throw new Error('Place not found after update');
      }

      expect(placeModel.name).toBe(updatePlaceDto.name);
      expect(placeModel.tel).toBe(updatePlaceDto.tel);
      expect(placeModel.isClosedOnHoliday).toBe(
        updatePlaceDto.isClosedOnHoliday,
      );
      expect(placeModel.type).toBe(updatePlaceDto.type);
      expect(placeModel.roadAddress.name).toBe(updatePlaceDto.roadAddress.name);
      expect(placeModel.roadAddress.detail).toBe(
        updatePlaceDto.roadAddress.detail,
      );
      expect(placeModel.imgPathList.sort()).toEqual(
        updatePlaceDto.imagePathList.sort(),
      );
      expect(placeModel.closedDayList.length).toBe(2);
      expect(placeModel.closedDayList[0].day).toBe(DayOfWeek.MON);
      expect(placeModel.closedDayList[0].week).toBe(1);
      expect(placeModel.closedDayList[1].day).toBe(DayOfWeek.TUE);
      expect(placeModel.closedDayList[1].week).toBe(2);
      expect(placeModel.breakTimeList.length).toBe(2);
      expect(placeModel.breakTimeList[0].startAt).toBe('12:00:00');
      expect(placeModel.breakTimeList[0].endAt).toBe('13:00:00');
      expect(placeModel.breakTimeList[0].day).toBe(DayOfWeek.WED);
      expect(placeModel.breakTimeList[1].startAt).toBe('14:00:00');
      expect(placeModel.breakTimeList[1].endAt).toBe('15:00:00');
      expect(placeModel.breakTimeList[1].day).toBe(DayOfWeek.FRI);
      expect(placeModel.operatingHourList.length).toBe(2);
      expect(placeModel.operatingHourList[0].startAt).toBe('10:00:00');
      expect(placeModel.operatingHourList[0].endAt).toBe('20:00:00');
      expect(placeModel.operatingHourList[0].day).toBe(DayOfWeek.THU);
      expect(placeModel.operatingHourList[1].startAt).toBe('11:00:00');
      expect(placeModel.operatingHourList[1].endAt).toBe('21:00:00');
      expect(placeModel.operatingHourList[1].day).toBe(DayOfWeek.SAT);
      expect(placeModel.weeklyClosedDayList.length).toBe(2);
      expect(placeModel.weeklyClosedDayList[0].date).toBe(
        updatePlaceDto.weeklyClosedDayList[0].date,
      );
      expect(placeModel.weeklyClosedDayList[0].type).toBe(
        updatePlaceDto.weeklyClosedDayList[0].type,
      );
      expect(placeModel.weeklyClosedDayList[1].date).toBe(
        updatePlaceDto.weeklyClosedDayList[1].date,
      );
      expect(placeModel.weeklyClosedDayList[1].type).toBe(
        updatePlaceDto.weeklyClosedDayList[1].type,
      );

      const pastWeeklyClosedDay = await testHelper
        .getPrisma()
        .weeklyClosedDay.findFirst({
          where: {
            placeIdx: place.idx,
            closedDate: new Date('2025-08-20T00:00:00.000Z'),
            type: WeeklyCloseType.BIWEEKLY,
          },
        });
      expect(pastWeeklyClosedDay).not.toBeNull();

      mock.mockRestore();
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      function getKstDateString(offsetDays = 0): string {
        const now = new Date();
        // 한국시간 보정 (+9시간)
        now.setHours(now.getHours() + 9);
        now.setDate(now.getDate() + offsetDays);

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [
          { day: DayOfWeek.MON, week: 1 },
          { day: DayOfWeek.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: DayOfWeek.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: DayOfWeek.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: DayOfWeek.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: DayOfWeek.SAT },
        ],
        weeklyClosedDayList: [
          { date: getKstDateString(), type: WeeklyCloseType.BIWEEKLY },
          { date: getKstDateString(1), type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${place.idx}`)
        .send(updatePlaceDto)
        .expect(401);
    });

    it('404 - there is no place with the given idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeIdx = -1; // ! no place with this idx

      function getKstDateString(offsetDays = 0): string {
        const now = new Date();
        // 한국시간 보정 (+9시간)
        now.setHours(now.getHours() + 9);
        now.setDate(now.getDate() + offsetDays);

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Place',
        tel: '032-9876-5432',
        isClosedOnHoliday: true,
        imagePathList: [
          '/place/updated-image1.png',
          '/place/updated-image2.png',
        ],
        type: PlaceType.RESTAURANT,
        roadAddress: {
          name: 'Updated Road',
          detail: 'Updated Detail',
          addressX: 37.123,
          addressY: 126.123,
        },
        closedDayList: [
          { day: DayOfWeek.MON, week: 1 },
          { day: DayOfWeek.TUE, week: 2 },
        ],
        breakTimeList: [
          { startAt: '12:00:00', endAt: '13:00:00', day: DayOfWeek.WED },
          { startAt: '14:00:00', endAt: '15:00:00', day: DayOfWeek.FRI },
        ],
        operatingHourList: [
          { startAt: '10:00:00', endAt: '20:00:00', day: DayOfWeek.THU },
          { startAt: '11:00:00', endAt: '21:00:00', day: DayOfWeek.SAT },
        ],
        weeklyClosedDayList: [
          { date: getKstDateString(), type: WeeklyCloseType.BIWEEKLY },
          { date: getKstDateString(1), type: WeeklyCloseType.BIWEEKLY },
        ],
      };

      await testHelper
        .test()
        .put(`/place/${placeIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updatePlaceDto)
        .expect(404);
    });
  });

  describe('DELETE /place/:idx', () => {
    it('200 - confirms place is deleted successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const placeAfterDelete = await testHelper
        .getPrisma()
        .place.findUniqueOrThrow({
          where: { idx: place.idx },
        });

      expect(placeAfterDelete.deletedAt).not.toBeNull();
    });

    it('404 - attempt to delete a place that was already deleted', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(), // ! already deleted
      });

      await testHelper
        .test()
        .delete(`/place/${place.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper.test().delete(`/place/${place.idx}`).expect(401);
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .delete(`/place/${invalidPlaceIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });
  });

  describe('POST /place/:idx/activate', () => {
    it('200 - confirms place is activated successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.activatedAt).not.toBeNull();
    });

    it('400 - attempt to activate a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .expect(401);
    });

    it('404 - attempt to activate a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to activate a place that was already activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(), // ! already activated
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/deactivate', () => {
    it('200 - confirms place is deactivated successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .expect(401);
    });

    it('400 - attempt to deactivate a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/deactivate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('404 - attempt to deactivate a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/deactivate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to deactivate a place that is not activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: null, // ! not activated
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/close-permanently', () => {
    it('200 - confirms place is closed permanently successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.permanentlyClosedAt).not.toBeNull();
    });

    it('400 - attempt to close permanently a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .expect(401);
    });

    it('404 - attempt to close permanently a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to close permanently a place that was already closed permanently', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: new Date(), // ! already closed permanently
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/:idx/cancel-close-permanently', () => {
    it('200 - confirms place is closed successfully', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const place = await testHelper.getPrisma().place.findUniqueOrThrow({
        where: { idx: placeSeed.idx },
      });

      expect(place.permanentlyClosedAt).toBeNull();
    });

    it('400 - attempt to close a place with invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx'; // ! invalid place idx

      await testHelper
        .test()
        .post(`/place/${invalidPlaceIdx}/cancel-close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null,
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .expect(401);
    });

    it('404 - attempt to close a place that does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = -1; // ! no place with this idx

      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/cancel-close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('409 - attempt to close a place that was already closed', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        activatedAt: new Date(),
        permanentlyClosedAt: null, // ! not closed permanently
      });

      await testHelper
        .test()
        .post(`/place/${placeSeed.idx}/cancel-close-permanently`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(409);
    });
  });

  describe('POST /place/cron/bi-weekly-closed-day', () => {
    it('200 - should create a next holiday for a single matching place', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const today = new Date('2025-08-20');
      await placeSeedHelper.seed({
        weeklyClosedDayList: [
          { closedDate: today, type: WeeklyCloseType.BIWEEKLY },
        ],
      });
      await placeSeedHelper.seed({
        weeklyClosedDayList: [
          { closedDate: today, type: WeeklyCloseType.BIWEEKLY },
        ],
      });

      const response = await testHelper
        .test()
        .post('/place/cron/bi-weekly-closed-day')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025-08-20' })
        .expect(200);

      const body: RunBiWeeklyClosedDayCronJobResponseDto = response.body;
      expect(body.successCount).toBe(2);
      expect(body.failureCount).toBe(0);
      expect(body.errorList).toEqual([]);
    });

    it('200 - should return a partial success if some job fail', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const today = new Date('2025-08-20');
      await placeSeedHelper.seed({
        weeklyClosedDayList: [
          { closedDate: today, type: WeeklyCloseType.BIWEEKLY },
        ],
      });
      const failPlace = await placeSeedHelper.seed({
        weeklyClosedDayList: [
          { closedDate: today, type: WeeklyCloseType.BIWEEKLY },
        ],
      });

      const placeCoreService =
        testHelper.get<PlaceCoreService>(PlaceCoreService);

      const mock = jest
        .spyOn(placeCoreService, 'createWeeklyClosedDay')
        .mockImplementation(async (placeIdx: number) => {
          // 만약 실패하기로 약속한 placeIdx가 들어오면, 일부러 에러를 발생
          if (placeIdx === failPlace.idx) {
            throw new Error('Simulated DB Error');
          }
          // 성공한 케이스는 통과
          return;
        });

      const response = await testHelper
        .test()
        .post('/place/cron/bi-weekly-closed-day')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025-08-20' })
        .expect(200);

      const body: RunBiWeeklyClosedDayCronJobResponseDto = response.body;

      expect(body.successCount).toBe(1);
      expect(body.failureCount).toBe(1);
      expect(body.errorList.length).toBe(1);
      expect(body.errorList[0].placeIdx).toBe(failPlace.idx);
      expect(body.errorList[0].errorMessage).toBe('Simulated DB Error');

      mock.mockRestore();
    });

    it('200- should return a zero summary if no places are found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      // 휴무일이 없는 장소 생성
      await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .post('/place/cron/bi-weekly-closed-day')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025-08-20' })
        .expect(200);

      const body: RunBiWeeklyClosedDayCronJobResponseDto = response.body;
      expect(body.successCount).toBe(0);
      expect(body.failureCount).toBe(0);
    });

    it('400 - invalid date', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place/cron/bi-weekly-closed-day')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025/08/20' }) // ! invalid date format
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      await placeSeedHelper.seed({});

      await testHelper
        .test()
        .post('/place/cron/bi-weekly-closed-day')
        .send({ date: '2025-08-20' })
        .expect(401);
    });
  });

  describe('POST /place/:idx/bi-weekly-closed-day', () => {
    it('200 - should create a new bi-weekly closed day', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      const closedDate = '2025-08-20';

      await testHelper
        .test()
        .post(`/place/${place.idx}/bi-weekly-closed-day`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: closedDate })
        .expect(200);

      const closedDay = await testHelper.getPrisma().weeklyClosedDay.findFirst({
        where: {
          placeIdx: place.idx,
          closedDate: new Date(closedDate),
          type: WeeklyCloseType.BIWEEKLY,
        },
      });

      expect(closedDay).not.toBeNull();
    });

    it('400 - invalid place idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post(`/place/invalid/bi-weekly-closed-day`) // ! invalid place idx
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025/08/20' })
        .expect(400);
    });

    it('401 - no access token provided', async () => {
      const place = await placeSeedHelper.seed({});

      await testHelper
        .test()
        .post(`/place/${place.idx}/bi-weekly-closed-day`)
        .send({ date: '2025-08-20' })
        .expect(401);
    });

    it('404 - place does not exist', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = 99999;
      await testHelper
        .test()
        .post(`/place/${nonExistentPlaceIdx}/bi-weekly-closed-day`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025-08-20' })
        .expect(404);
    });

    it('409 - the closed day already exists', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const date = new Date('2025-08-20');
      const place = await placeSeedHelper.seed({
        weeklyClosedDayList: [
          { closedDate: date, type: WeeklyCloseType.BIWEEKLY },
        ],
      });

      await testHelper
        .test()
        .post(`/place/${place.idx}/bi-weekly-closed-day`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ date: '2025-08-20' })
        .expect(409);
    });
  });
});
