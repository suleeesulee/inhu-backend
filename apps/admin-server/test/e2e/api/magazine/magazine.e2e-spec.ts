import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { MagazineSeedHelper } from '@libs/testing/seed/magazine/magazine.seed';
import { MagazineEntity } from '@admin/api/magazine/entity/magazine.entity';
import { MagazineOverviewEntity } from '@admin/api/magazine/entity/magazine-overview.entity';
import { PinnedMagazineSeedHelper } from '@libs/testing/seed/pinned-magazine/pinned-magazine.seed';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { AdminAccountSeedHelper } from '@libs/testing/seed/admin-account/admin-account.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { AdminRole } from '@admin/api/auth/admin-role.enum';

describe('Magazine e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const magazineSeedHelper = testHelper.seedHelper(MagazineSeedHelper);
  const pinnedMagazineSeedHelper = testHelper.seedHelper(
    PinnedMagazineSeedHelper,
  );
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const adminAccountSeedHelper = testHelper.seedHelper(AdminAccountSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /magazine/all', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        name: 'Test Place',
        tel: '010-1234-5678',
        roadAddress: {
          name: 'Test Road Address',
          detail: 'Test Detail Address',
          addressX: 37.123456,
          addressY: 127.123456,
        },
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Test Magazine',
        description: 'Test Description',
        content: 'Test Content',
        thumbnailPath: '/test-image.png',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
        placeIdxList: [placeSeed.idx],
        typeList: [PlaceType.CAFE],
        mainCategoryList: [MainCategory.BAKERY, MainCategory.SANDWICH_SALAD],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, activated: true })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(1);
      expect(count).toBe(1);

      const magazine: MagazineOverviewEntity = magazineList[0];

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.activatedAt).not.toBeNull();
      expect(magazine.activatedAt).toEqual(
        magazineSeed.activatedAt?.toISOString(),
      );
      expect(magazine.typeList).toEqual(magazineSeed.typeList);
      expect(magazine.mainCategoryList).toEqual(magazineSeed.mainCategoryList);
      expect(magazine.moodCategoryList).toEqual(magazineSeed.moodCategoryList);
    });

    it('200 - magazineList empty due to page too high', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      await magazineSeedHelper.seedAll([
        { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
        { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 2, activated: true })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(0);
      expect(count).toBe(2);
    });

    it('200 - activated filter (undefined)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [magazine1, magazine2] = await magazineSeedHelper.seedAll([
        { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
        { authorIdx: loginUser.idx, deletedAt: null, activatedAt: null },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1 })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(count).toBe(2);
      expect(magazineList[0].idx).toBe(magazine2.idx);
      expect(magazineList[1].idx).toBe(magazine1.idx);
    });

    it('200 - activated filter (false)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          { authorIdx: loginUser.idx, deletedAt: null, activatedAt: null },
          { authorIdx: loginUser.idx, deletedAt: null, activatedAt: null },
        ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, activated: false })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(count).toBe(2);
      expect(magazineList[0].idx).toBe(magazine3.idx);
      expect(magazineList[1].idx).toBe(magazine2.idx);
    });

    it('200 - activated filter (true)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          { authorIdx: loginUser.idx, deletedAt: null, activatedAt: null },
        ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, activated: true })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(count).toBe(2);
      expect(magazineList[0].idx).toBe(magazine2.idx);
      expect(magazineList[1].idx).toBe(magazine1.idx);
    });

    it('200 - pinned filter (true)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
        ]);

      await pinnedMagazineSeedHelper.seedAll([
        { idx: magazine1.idx },
        { idx: magazine2.idx },
      ]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, pinned: true })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(count).toBe(3);
      expect(magazineList[0].idx).toBe(magazine2.idx);
      expect(magazineList[1].idx).toBe(magazine1.idx);
    });

    it('200 - pinned filter (false)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [magazine1, magazine2, magazine3] =
        await magazineSeedHelper.seedAll([
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
          {
            authorIdx: loginUser.idx,
            deletedAt: null,
            activatedAt: new Date(),
          },
        ]);

      await pinnedMagazineSeedHelper.seedAll([{ idx: magazine1.idx }]);

      const response = await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 1, pinned: false })
        .expect(200);

      const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
      const count: number = response.body.count;

      expect(Array.isArray(magazineList)).toBe(true);
      expect(magazineList.length).toBe(2);
      expect(count).toBe(3);
      expect(magazineList[0].idx).toBe(magazine3.idx);
      expect(magazineList[1].idx).toBe(magazine2.idx);
    });

    // it('200 - pinned filter (undefined)', async () => {
    //   const loginUser = testHelper.loginAdmin.admin1;
    //   const [magazine1, magazine2, magazine3, magazine4] =
    //     await magazineSeedHelper.seedAll([
    //       { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
    //       { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
    //       { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
    //       { authorIdx: loginUser.idx, deletedAt: null, activatedAt: new Date() },
    //     ]);

    //   await pinnedMagazineSeedHelper.seedAll([
    //     { idx: magazine1.idx },
    //     { idx: magazine2.idx },
    //   ]);

    //   const response = await testHelper
    //     .test()
    //     .get('/magazine/all')
    //     .set('Cookie', `token=Bearer ${loginUser.token}`)
    //     .query({ page: 1 })
    //     .expect(200);

    //   const magazineList: MagazineOverviewEntity[] = response.body.magazineList;
    //   const count: number = response.body.count;

    //   expect(Array.isArray(magazineList)).toBe(true);
    //   expect(magazineList.length).toBe(4);
    //   expect(count).toBe(4);
    //   expect(magazineList[0].idx).toBe(magazine2.idx);
    //   expect(magazineList[1].idx).toBe(magazine1.idx);
    //   expect(magazineList[2].idx).toBe(magazine4.idx);
    //   expect(magazineList[3].idx).toBe(magazine3.idx);
    // });

    it('200 - successfully get magazine (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('200 - successfully get magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('200 - successfully get magazine (magazine admin)', async () => {
      const loginUser = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('400 - invalid page', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query({ page: 'invalid-page', activated: true })
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      await testHelper
        .test()
        .get('/magazine/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });
  });

  describe('GET /magazine/:idx', () => {
    it('200 - field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        name: 'Test Place',
        tel: '010-1234-5678',
        roadAddress: {
          name: 'Test Road Address',
          detail: 'Test Detail Address',
          addressX: 37.123456,
          addressY: 127.123456,
        },
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Test Magazine',
        description: 'Test Description',
        content: 'Test Content',
        thumbnailPath: 'Test Thumbnail',
        isTitleVisible: true,
        activatedAt: new Date(),
        deletedAt: null,
        placeIdxList: [placeSeed.idx],
        typeList: [PlaceType.CAFE],
        mainCategoryList: [MainCategory.BAKERY, MainCategory.SANDWICH_SALAD],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.idx).toBe(magazineSeed.idx);
      expect(magazine.title).toBe(magazineSeed.title);
      expect(magazine.description).toBe(magazineSeed.description);
      expect(magazine.content).toBe(magazineSeed.content);
      expect(magazine.thumbnailImagePath).toBe(magazineSeed.thumbnailPath);
      expect(magazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(magazine.likeCount).toBe(0);
      expect(magazine.viewCount).toBe(0);
      expect(magazine.activatedAt).not.toBeNull();
      expect(magazine.activatedAt).toEqual(
        magazineSeed.activatedAt?.toISOString(),
      );
      expect(Array.isArray(magazine.placeList)).toBe(true);
      expect(magazine.placeList.length).toBe(1);
      expect(magazine.placeList[0].idx).toBe(placeSeed.idx);
      expect(magazine.placeList[0].name).toBe(placeSeed.name);
      expect(magazine.placeList[0].tel).toBe(placeSeed.tel);
      expect(magazine.placeList[0].roadAddress).toEqual({
        name: placeSeed.roadAddress.name,
        detail: placeSeed.roadAddress.detail,
        addressX: placeSeed.roadAddress.addressX,
        addressY: placeSeed.roadAddress.addressY,
      });
      expect(magazine.placeList[0].imagePathList).toEqual(
        placeSeed.placeImgList,
      );
      expect(magazine.typeList).toEqual(magazineSeed.typeList);
      expect(magazine.mainCategoryList).toEqual(magazineSeed.mainCategoryList);
      expect(magazine.moodCategoryList).toEqual(magazineSeed.moodCategoryList);
    });

    it('200 - does not increase view count', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const magazine: MagazineEntity = response.body;

      expect(magazine.viewCount).toBe(0);
    });

    it('200 - successfully get magazine (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('200 - successfully get magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('200 - successfully get magazine (magazine admin)', async () => {
      const loginUser = testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body.idx).toBe(magazineSeed.idx);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .get(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .get(`/magazine/${nonExistentMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });

  describe('POST /magazine', () => {
    it('201 - successfully create magazine and field check', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        name: 'Test Place',
        tel: '010-1234-5678',
        roadAddress: {
          name: 'Test Road Address',
          detail: 'Test Detail Address',
          addressX: 37.123456,
          addressY: 127.123456,
        },
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        description: 'New Description',
        content: `This is a new magazine. Look at this!! :::place-${placeSeed.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;
      const selectMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: resultMagazine.idx },
          include: { placeList: true },
        });

      expect(resultMagazine.idx).toBe(selectMagazine.idx);
      expect(resultMagazine.title).toBe(createMagazineDto.title);
      expect(resultMagazine.description).toBe(createMagazineDto.description);
      expect(resultMagazine.content).toBe(createMagazineDto.content);
      expect(resultMagazine.thumbnailImagePath).toBe(
        createMagazineDto.thumbnailImagePath,
      );
      expect(resultMagazine.isTitleVisible).toBe(
        createMagazineDto.isTitleVisible,
      );
      expect(resultMagazine.likeCount).toBe(0);
      expect(resultMagazine.viewCount).toBe(0);
      expect(resultMagazine.activatedAt).toBeNull();
      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(1);
      expect(resultMagazine.placeList[0].idx).toBe(placeSeed.idx);
      expect(resultMagazine.placeList[0].name).toBe(placeSeed.name);
      expect(resultMagazine.placeList[0].tel).toBe(placeSeed.tel);
      expect(resultMagazine.placeList[0].roadAddress).toEqual({
        name: placeSeed.roadAddress.name,
        detail: placeSeed.roadAddress.detail,
        addressX: placeSeed.roadAddress.addressX,
        addressY: placeSeed.roadAddress.addressY,
      });
      expect(resultMagazine.placeList[0].imagePathList).toEqual(
        placeSeed.placeImgList,
      );
      expect(resultMagazine.placeList[0].bookmark).toBe(false);
    });

    it('201 - no place in magazine content (placeIdxList is empty)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: 'New Magazine',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(0);
    });

    it('201 - multiple places in magazine content(separate place information)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed1 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const placeSeed2 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        content: `This is a new magazine. :::place-${placeSeed1.idx}::: ....... :::place-${placeSeed2.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(2);
      const placeIdxList = resultMagazine.placeList.map((p) => p.idx);
      expect(placeIdxList).toContain(placeSeed1.idx);
      expect(placeIdxList).toContain(placeSeed2.idx);
    });

    it('201 - multiple places in magazine content (:::place-1::::::place-2:::', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed1 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const placeSeed2 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        content: `This is a new magazine. :::place-${placeSeed1.idx}::::::place-${placeSeed2.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(2);
      const placeIdxList = resultMagazine.placeList.map((p) => p.idx);
      expect(placeIdxList).toContain(placeSeed1.idx);
      expect(placeIdxList).toContain(placeSeed2.idx);
    });

    it('201 - multiple places in magazine content (:::place-1::::place-2:::)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed1 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const placeSeed2 = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        content: `This is a new magazine. :::place-${placeSeed1.idx}::::place-${placeSeed2.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(1);
      expect(resultMagazine.placeList[0].idx).toBe(placeSeed1.idx);
    });

    it('201 - duplicate places in magazine content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        content: `This is a new magazine. :::place-${placeSeed.idx}::: ....... :::place-${placeSeed.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(1);
      expect(resultMagazine.placeList[0].idx).toBe(placeSeed.idx);
    });

    it('201 - invalid place and valid place idx in magazine content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });

      const createMagazineDto = {
        title: 'New Magazine',
        content: `This is a new magazine. :::place-999999::: ....... :::place-${placeSeed.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(Array.isArray(resultMagazine.placeList)).toBe(true);
      expect(resultMagazine.placeList.length).toBe(1);
      expect(resultMagazine.placeList[0].idx).toBe(placeSeed.idx);
    });

    it('201 - successfully create magazine (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const createMagazineDto = {
        title: 'New Magazine',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(resultMagazine.title).toBe(createMagazineDto.title);
      expect(resultMagazine.content).toBe(createMagazineDto.content);
      expect(resultMagazine.thumbnailImagePath).toBe(
        createMagazineDto.thumbnailImagePath,
      );
      expect(resultMagazine.isTitleVisible).toBe(
        createMagazineDto.isTitleVisible,
      );
    });

    it('201 - successfully create magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const createMagazineDto = {
        title: 'New Magazine',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      const response = await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(201);

      const resultMagazine: MagazineEntity = response.body;

      expect(resultMagazine.title).toBe(createMagazineDto.title);
      expect(resultMagazine.content).toBe(createMagazineDto.content);
      expect(resultMagazine.thumbnailImagePath).toBe(
        createMagazineDto.thumbnailImagePath,
      );
      expect(resultMagazine.isTitleVisible).toBe(
        createMagazineDto.isTitleVisible,
      );
    });

    it('400 - title is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: '',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(400);
    });

    it('400 - content is empty', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const createMagazineDto = {
        title: 'New Magazine',
        content: '',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createMagazineDto)
        .expect(400);
    });

    it('403 - unauthorized admin', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;

      const createMagazineDto = {
        title: 'New Magazine',
        content: 'This is a new magazine.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
        placeIdxList: null,
      };

      await testHelper
        .test()
        .post('/magazine')
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(createMagazineDto)
        .expect(403);
    });
  });

  describe('POST /magazine/:idx/activate', () => {
    it('200 - successfully activate magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
      ]);
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Test Magazine',
        description: 'Test Description',
        content: `Test Content. here is place :::place-${place1.idx}:::`,
        thumbnailPath: 'Test Thumbnail',
        isTitleVisible: true,
        likeCount: 10,
        viewCount: 100,
        deletedAt: null,
        activatedAt: null,
        placeIdxList: [place1.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: true })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(magazineSeed.title);
      expect(updatedMagazine.description).toBe(magazineSeed.description);
      expect(updatedMagazine.content).toBe(magazineSeed.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        magazineSeed.thumbnailPath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(updatedMagazine.likeCount).toBe(magazineSeed.likeCount);
      expect(updatedMagazine.viewCount).toBe(magazineSeed.viewCount);
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(place1.idx);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully deactivate magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Test Magazine',
        description: 'Test Description',
        content: `Test Content. here is place :::place-${placeSeed.idx}:::`,
        thumbnailPath: 'Test Thumbnail',
        isTitleVisible: true,
        likeCount: 10,
        viewCount: 100,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(magazineSeed.title);
      expect(updatedMagazine.description).toBe(magazineSeed.description);
      expect(updatedMagazine.content).toBe(magazineSeed.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        magazineSeed.thumbnailPath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(magazineSeed.isTitleVisible);
      expect(updatedMagazine.likeCount).toBe(magazineSeed.likeCount);
      expect(updatedMagazine.viewCount).toBe(magazineSeed.viewCount);
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(placeSeed.idx);
      expect(updatedMagazine.activatedAt).toBeNull();
    });

    it('200 - successfully activate magazine (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: null,
        placeIdxList: [placeSeed.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: true })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully deactivate magazine (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.activatedAt).toBeNull();
    });

    it('200 - successfully activate magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: null,
        placeIdxList: [placeSeed.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: true })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully deactivate magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const response = await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(200);

      expect(response.body).toEqual({});

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.activatedAt).toBeNull();
    });

    it('400 - invalid magazine idx (activate)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      await testHelper
        .test()
        .post(`/magazine/${invalidMagazineIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('400 - invalid magazine idx (deactivate)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      await testHelper
        .test()
        .post(`/magazine/${invalidMagazineIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('403 - unauthorized admin', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: allAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send({ activate: true })
        .expect(403);
    });

    it('403 - admin is not the author of magazine (activate)', async () => {
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;
      const magazineAdmin2 = await testHelper.loginAdmin.magazineAdmin2;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin1.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${magazineAdmin2.token}`)
        .send({ activate: true })
        .expect(403);
    });

    it('403 - admin is not the author of magazine (deactivate)', async () => {
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;
      const magazineAdmin2 = await testHelper.loginAdmin.magazineAdmin2;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin1.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${magazineAdmin2.token}`)
        .send({ activate: false })
        .expect(403);
    });

    it('404 - magazine not found (activate)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .post(`/magazine/${nonExistentMagazineIdx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: true })
        .expect(404);
    });

    it('404 - magazine not found (deactivate)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .post(`/magazine/${nonExistentMagazineIdx}/deactivate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(404);
    });

    it('409 - magazine is already activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: true })
        .expect(409);
    });

    it('409 - magazine is not activated', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/magazine/${magazineSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ activate: false })
        .expect(409);
    });
  });

  describe('PUT /magazine/:idx/category', () => {
    it('200 - successfully update single type to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.RESTAURANT],
          mainCategoryList: [],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
      });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.RESTAURANT);
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully update multiple type to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE, PlaceType.RESTAURANT],
          mainCategoryList: [],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
        orderBy: { placeTypeIdx: 'asc' },
      });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
      });

      expect(afterTypeList.length).toBe(2);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterTypeList[1].placeTypeIdx).toBe(PlaceType.RESTAURANT);
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates single main category and no mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
      });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(1);
      expect(afterMainCategoryList[0].mainCategoryIdx).toBe(
        MainCategory.DESSERT,
      );
      expect(afterMoodCategoryList.length).toBe(0);
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates no main category and single mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
      });

      expect(afterTypeList.length).toBe(1);
      expect(afterTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(afterMainCategoryList.length).toBe(0);
      expect(afterMoodCategoryList.length).toBe(1);
      expect(afterMoodCategoryList[0].moodCategoryIdx).toBe(
        MoodCategory.GOOD_ATMOSPHERE,
      );
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates multiple main category and single mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 successfully updates single main category and multiple mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
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

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates multiple main category and no mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT, MainCategory.SANDWICH_SALAD],
          moodCategoryList: [],
        })
        .expect(200);

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates no main category and multiple mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
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

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates duplicate category is ignored and unique categories are added to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
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

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully updates multiple types, main category and mood category to magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        typeList: [PlaceType.CAFE],
        mainCategoryList: [
          MainCategory.BAKERY,
          MainCategory.BUNGEOPPANG_WAFFLE,
        ],
        moodCategoryList: [
          MoodCategory.STUDY_FRIENDLY,
          MoodCategory.DESSERT_HOTSPOT,
        ],
        activatedAt: new Date(),
      });

      const prisma = testHelper.getPrisma();
      const beforeTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const beforeMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const beforeMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });

      expect(beforeTypeList.length).toBe(1);
      expect(beforeTypeList[0].placeTypeIdx).toBe(PlaceType.CAFE);
      expect(beforeMainCategoryList.length).toBe(2);
      expect(beforeMoodCategoryList.length).toBe(2);

      await testHelper
        .test()
        .put(`/magazine/${magazine.idx}/category`)
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

      const afterTypeList = await prisma.placeTypeMagazineMapping.findMany({
        where: { magazineIdx: magazine.idx },
      });
      const afterMainCategoryList =
        await prisma.magazineMainCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMoodCategoryList =
        await prisma.magazineMoodCategoryMapping.findMany({
          where: { magazineIdx: magazine.idx },
        });
      const afterMagazine = await prisma.magazine.findUniqueOrThrow({
        where: { idx: magazine.idx },
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
      expect(afterMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully update (super admin)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        typeList: [PlaceType.CAFE],
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
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);
    });

    it('200 - successfully update (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazine = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        typeList: [PlaceType.CAFE],
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
        .put(`/magazine/${magazine.idx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(200);
    });

    it('401 - no access token', async () => {
      const magazine = await magazineSeedHelper.seed({
        authorIdx: testHelper.loginAdmin.admin1.idx,
        typeList: [PlaceType.CAFE],
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
        .put(`/magazine/${magazine.idx}/category`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(401);
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidPlaceIdx = 'invalid-idx';

      await testHelper
        .test()
        .put(`/magazine/${invalidPlaceIdx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(400);
    });

    it('403 - unauthorized admin', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}/category`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send({
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(403);
    });

    // it('403 - admin is not the author of magazine', async () => {
    //   const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
    //   const otherMagazineAdmin = await testHelper.loginAdmin.magazineAdmin2;
    //   const magazineSeed = await magazineSeedHelper.seed({
    //     authorIdx: magazineAdmin.idx,
    //     activatedAt: new Date(),
    //   });

    //   await testHelper
    //     .test()
    //     .put(`/magazine/${magazineSeed.idx}/category`)
    //     .set('Cookie', `token=Bearer ${otherMagazineAdmin.token}`)
    //     .send({
    //       typeList: [PlaceType.CAFE],
    //       mainCategoryList: [MainCategory.DESSERT],
    //       moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
    //     })
    //     .expect(403);
    // });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentPlaceIdx = 99999;

      await testHelper
        .test()
        .put(`/magazine/${nonExistentPlaceIdx}/category`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({
          typeList: [PlaceType.CAFE],
          mainCategoryList: [MainCategory.DESSERT],
          moodCategoryList: [MoodCategory.GOOD_ATMOSPHERE],
        })
        .expect(404);
    });
  });

  describe('PUT /magazine/:idx', () => {
    it('200 - successfully update magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [place1, place2] = await placeSeedHelper.seedAll([
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
      ]);
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place 1 :::place-${place1.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [place1.idx],
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: `New Content, here is place 2 :::place-${place2.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(place2.idx);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - update magazine with no place in content (placeIdxList becomes empty)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place :::place-${placeSeed.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content with no place.',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(0);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - update magazine with multiple places in content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const [place1, place2, place3] = await placeSeedHelper.seedAll([
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
        {
          deletedAt: null,
          activatedAt: new Date(),
        },
      ]);
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place 1 :::place-${place1.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [place1.idx],
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: `New Content, here is place 1 :::place-${place1.idx}::: and place 2 :::place-${place2.idx}::: and place 3 :::place-${place3.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(3);
      expect(updatedMagazine.activatedAt).not.toBeNull();
      const placeIdxList = updatedMagazine.placeList.map((p) => p.placeIdx);
      expect(placeIdxList).toContain(place1.idx);
      expect(placeIdxList).toContain(place2.idx);
      expect(placeIdxList).toContain(place3.idx);
    });

    it('200 - update magazine with duplicate places in content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place :::place-${placeSeed.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: `New Content, here is place :::place-${placeSeed.idx}::: and again place :::place-${placeSeed.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(placeSeed.idx);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - update magazine with invalid and valid place idx in content', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place :::place-${placeSeed.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: `New Content, here is invalid place :::place-999999::: and valid place :::place-${placeSeed.idx}:::`,
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(placeSeed.idx);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - update magazine with no changes', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const placeSeed = await placeSeedHelper.seed({
        deletedAt: null,
        activatedAt: new Date(),
      });
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: `Old Content. here is place :::place-${placeSeed.idx}:::`,
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
        placeIdxList: [placeSeed.idx],
      });

      const updateMagazineDto = {
        title: magazineSeed.title,
        description: magazineSeed.description,
        content: magazineSeed.content,
        thumbnailImagePath: magazineSeed.thumbnailPath,
        isTitleVisible: magazineSeed.isTitleVisible,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);

      const updatedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
          include: { placeList: true },
        });

      expect(updatedMagazine.title).toBe(updateMagazineDto.title);
      expect(updatedMagazine.description).toBe(updateMagazineDto.description);
      expect(updatedMagazine.content).toBe(updateMagazineDto.content);
      expect(updatedMagazine.thumbnailImagePath).toBe(
        updateMagazineDto.thumbnailImagePath,
      );
      expect(updatedMagazine.isTitleVisible).toBe(
        updateMagazineDto.isTitleVisible,
      );
      expect(updatedMagazine.placeList.length).toBe(1);
      expect(updatedMagazine.placeList[0].placeIdx).toBe(placeSeed.idx);
      expect(updatedMagazine.activatedAt).not.toBeNull();
    });

    it('200 - successfully update magazine (super admin)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: 'Old Content',
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(updateMagazineDto)
        .expect(200);
    });

    it('200 - successfully update magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        title: 'Old Title',
        description: 'Old Description',
        content: 'Old Content',
        thumbnailPath: '/old-thumbnail.jpg',
        isTitleVisible: false,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(200);
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${invalidMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(400);
    });

    it('403 - unauthorized admin', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        activatedAt: new Date(),
      });

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(updateMagazineDto)
        .expect(403);
    });

    // it('403 - admin is not the author of magazine', async () => {
    //   const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
    //   const otherMagazineAdmin = await testHelper.loginAdmin.magazineAdmin2;
    //   const magazineSeed = await magazineSeedHelper.seed({
    //     authorIdx: magazineAdmin.idx,
    //     activatedAt: new Date(),
    //   });

    //   const updateMagazineDto = {
    //     title: 'New Title',
    //     description: 'New Description',
    //     content: 'New Content',
    //     thumbnailImagePath: '/new-thumbnail.jpg',
    //     isTitleVisible: true,
    //   };

    //   await testHelper
    //     .test()
    //     .put(`/magazine/${magazineSeed.idx}`)
    //     .set('Cookie', `token=Bearer ${otherMagazineAdmin.token}`)
    //     .send(updateMagazineDto)
    //     .expect(403);
    // });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      const updateMagazineDto = {
        title: 'New Title',
        description: 'New Description',
        content: 'New Content',
        thumbnailImagePath: '/new-thumbnail.jpg',
        isTitleVisible: true,
      };

      await testHelper
        .test()
        .put(`/magazine/${nonExistentMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateMagazineDto)
        .expect(404);
    });
  });

  describe('DELETE /magazine/:idx', () => {
    it('200 - successfully delete magazine', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: loginUser.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      expect(response.body).toEqual({});

      const deletedMagazine = await testHelper
        .getPrisma()
        .magazine.findUniqueOrThrow({
          where: { idx: magazineSeed.idx },
        });

      expect(deletedMagazine.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete magazine (super admin)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);
    });

    it('200 - successfully delete magazine (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        deletedAt: null,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);
    });

    it('400 - invalid magazine idx', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const invalidMagazineIdx = 'invalid-magazine-idx';

      await testHelper
        .test()
        .delete(`/magazine/${invalidMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(400);
    });

    it('403 - unauthorized admin', async () => {
      const allAdmin = await testHelper.loginAdmin.allAdmin1;
      const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
      const magazineSeed = await magazineSeedHelper.seed({
        authorIdx: magazineAdmin.idx,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/magazine/${magazineSeed.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });

    // it('403 - admin is not the author of magazine', async () => {
    //   const magazineAdmin = await testHelper.loginAdmin.magazineAdmin1;
    //   const otherMagazineAdmin = await testHelper.loginAdmin.magazineAdmin2;
    //   const magazineSeed = await magazineSeedHelper.seed({
    //     authorIdx: magazineAdmin.idx,
    //     activatedAt: new Date(),
    //   });

    //   await testHelper
    //     .test()
    //     .delete(`/magazine/${magazineSeed.idx}`)
    //     .set('Cookie', `token=Bearer ${otherMagazineAdmin.token}`)
    //     .expect(403);
    // });

    it('404 - magazine not found', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const nonExistentMagazineIdx = 9999999;

      await testHelper
        .test()
        .delete(`/magazine/${nonExistentMagazineIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });
});
