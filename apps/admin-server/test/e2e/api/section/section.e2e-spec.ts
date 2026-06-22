import { MagazineSectionSeedHelper } from '@libs/testing/seed/magazine-section/magazine-section';
import { TestHelper } from '../../setup/test.helper';
import { AdminServerModule } from '@admin/admin-server.module';
import { PlaceSectionSeedHelper } from '@libs/testing/seed/place-section/place-section';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import {
  MagazineSectionItem,
  PlaceSectionItem,
} from '@admin/api/section/dto/response/get-combined-section-all.response.dto';
import { MagazineSectionEntity } from '@admin/api/section/entity/magazine-section.entity';
import { all } from 'axios';
import { MagazineSectionCoreService } from '@libs/core/magazine-section/magazine-section-core.service';
import { UpdateMagazineSectionDto } from '@admin/api/section/dto/request/update-magazine-section.dto';
import { CreatePlaceSectionDto } from '@admin/api/section/dto/request/create-place-section.dto';
import { PlaceSectionEntity } from '@admin/api/section/entity/place-section.entity';
import { PlaceSectionCoreService } from '@libs/core/place-section/place-section-core.service';
import { UpdatePlaceSectionDto } from '@admin/api/section/dto/request/update-place-section.dto';

describe('Admin Section E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const placeSectionSeedHelper = testHelper.seedHelper(PlaceSectionSeedHelper);
  const magazineSectionSeedHelper = testHelper.seedHelper(
    MagazineSectionSeedHelper,
  );

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /section/all', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Test place section title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          freeTagList: ['test free tag'],
          mainCategoryList: [13],
        },
        deletedAt: null,
      });
      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        response.body.combinedSectionList;

      const placeSection = combinedSectionList.find(
        (section) => section.type === 'PLACE',
      ) as PlaceSectionItem;
      const magazineSection = combinedSectionList.find(
        (section) => section.type === 'MAGAZINE',
      ) as MagazineSectionItem;

      expect(combinedSectionList).toBeDefined();
      expect(Array.isArray(combinedSectionList)).toBe(true);
      expect(combinedSectionList.length).toBe(2);

      expect(placeSection).toBeDefined();
      expect(placeSection.title).toBe(placeSectionSeed.title);
      expect(placeSection.parameter).toEqual(placeSectionSeed.parameter);
      expect(placeSection.sortOrder).toBe(placeSectionSeed.sortOrder);
      expect(placeSection.type).toBe('PLACE');

      expect(magazineSection).toBeDefined();
      expect(magazineSection.title).toBe(magazineSectionSeed.title);
      expect(magazineSection.parameter).toEqual(magazineSectionSeed.parameter);
      expect(magazineSection.sortOrder).toBe(magazineSectionSeed.sortOrder);
      expect(magazineSection.type).toBe('MAGAZINE');
    });

    it('200 - empty section list', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        response.body.combinedSectionList;

      expect(combinedSectionList).toBeDefined();
      expect(Array.isArray(combinedSectionList)).toBe(true);
      expect(combinedSectionList.length).toBe(0);
    });

    it('200 - sort order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Test place section title 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Test place section title 2',
        deletedAt: null,
      });
      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Test magazine section title 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Test magazine section title 2',
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        response.body.combinedSectionList;

      expect(combinedSectionList[0].sortOrder).toBe(combinedSectionList.length);
      for (let i = 0; i < combinedSectionList.length - 1; i++) {
        const current = combinedSectionList[i];
        const next = combinedSectionList[i + 1];
        expect(current.sortOrder).toBe(next.sortOrder + 1);
      }
    });

    it('200 - successfully get section (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Test place section title',
        deletedAt: null,
      });
      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Test magazine section title',
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        response.body.combinedSectionList;

      const placeSection = combinedSectionList.find(
        (section) => section.type === 'PLACE',
      ) as PlaceSectionItem;
      const magazineSection = combinedSectionList.find(
        (section) => section.type === 'MAGAZINE',
      ) as MagazineSectionItem;

      expect(placeSection).toBeDefined();
      expect(placeSection.title).toBe(placeSectionSeed.title);

      expect(magazineSection).toBeDefined();
      expect(magazineSection.title).toBe(magazineSectionSeed.title);
    });

    it('200 - successfully get section (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Test place section title',
        deletedAt: null,
      });
      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Test magazine section title',
        deletedAt: null,
      });

      const response = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        response.body.combinedSectionList;

      const placeSection = combinedSectionList.find(
        (section) => section.type === 'PLACE',
      ) as PlaceSectionItem;
      const magazineSection = combinedSectionList.find(
        (section) => section.type === 'MAGAZINE',
      ) as MagazineSectionItem;

      expect(placeSection).toBeDefined();
      expect(placeSection.title).toBe(placeSectionSeed.title);

      expect(magazineSection).toBeDefined();
      expect(magazineSection.title).toBe(magazineSectionSeed.title);
    });

    it('400 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });
  });

  // magazine-section
  describe('POST /magazine-section', () => {
    it('200 - successfully create magazine section and field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto = {
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const magazineSection: MagazineSectionEntity = response.body;

      expect(magazineSection).toBeDefined();
      expect(magazineSection.idx).toBeDefined();
      expect(magazineSection.title).toBe(createDto.title);
      expect(magazineSection.parameter).toEqual(createDto.parameter);
      expect(magazineSection.sortOrder).toBe(1);
      expect(magazineSection.createdAt).toBeDefined();
    });

    it('200 - successfully create magazine section (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const createDto = {
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createDto)
        .expect(201);

      const magazineSection: MagazineSectionEntity = response.body;

      expect(magazineSection).toBeDefined();
      expect(magazineSection.idx).toBeDefined();
      expect(magazineSection.title).toBe(createDto.title);
    });

    it('200 - successfully create magazine section (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto = {
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const magazineSection: MagazineSectionEntity = response.body;

      expect(magazineSection).toBeDefined();
      expect(magazineSection.idx).toBeDefined();
      expect(magazineSection.title).toBe(createDto.title);
    });

    it('200 - successfully create magazine section with existing place/magazine sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await placeSectionSeedHelper.seedAll([
        {
          title: 'Existing Place Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Place Section 2',
          deletedAt: null,
        },
      ]);

      await magazineSectionSeedHelper.seedAll([
        {
          title: 'Existing Magazine Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Magazine Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newMagazineSection: MagazineSectionEntity = response.body;

      expect(newMagazineSection).toBeDefined();
      expect(newMagazineSection.idx).toBeDefined();
      expect(newMagazineSection.title).toBe(createDto.title);
      expect(newMagazineSection.sortOrder).toBe(5);
    });

    it('200 - successfully create magazine section with existing place sections but no magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await placeSectionSeedHelper.seedAll([
        {
          title: 'Existing Place Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Place Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newMagazineSection: MagazineSectionEntity = response.body;

      expect(newMagazineSection).toBeDefined();
      expect(newMagazineSection.idx).toBeDefined();
      expect(newMagazineSection.title).toBe(createDto.title);
      expect(newMagazineSection.sortOrder).toBe(3);
    });

    it('200 - successfully create magazine section with existing magazine sections but no place section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await magazineSectionSeedHelper.seedAll([
        {
          title: 'Existing Magazine Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Magazine Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newMagazineSection: MagazineSectionEntity = response.body;

      expect(newMagazineSection).toBeDefined();
      expect(newMagazineSection.idx).toBeDefined();
      expect(newMagazineSection.title).toBe(createDto.title);
      expect(newMagazineSection.sortOrder).toBe(3);
    });

    it('200 - successfully create magazine section with no existing place/magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newMagazineSection: MagazineSectionEntity = response.body;

      expect(newMagazineSection).toBeDefined();
      expect(newMagazineSection.idx).toBeDefined();
      expect(newMagazineSection.title).toBe(createDto.title);
      expect(newMagazineSection.sortOrder).toBe(1);
    });

    it('200 - successfully create magazine section with existing place/magazine sections after deleting magazine section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed1.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully create magazine section with existing place/magazine sections after deleting place section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully create magazine section with existing place section but no existing magazine section after deleting place section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].sortOrder).toBe(1);
      expect(allSectionList[1].idx).toBe(placeSectionSeed1.idx);
    });

    it('200 - successfully create magazine section with existing magazine section but no existing place section after deleting magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Magazine Section',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('400 - invalid parameter', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const invalidCreateDto = {
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'invalid_order_by',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidCreateDto)
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const createDto = {
        title: 'Test magazine section title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/magazine-section')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createDto)
        .expect(403);
    });
  });

  describe('PUT /magazine-section/:idx', () => {
    it('200 - successfully update magazine section and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Original Magazine Section Title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdateMagazineSectionDto = {
        title: 'Updated Magazine Section Title',
        parameter: {
          orderBy: 'like',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedMagazineSectionModel = await testHelper
        .get(MagazineSectionCoreService)
        .getMagazineSectionByIdx(magazineSectionSeed.idx);

      if (!updatedMagazineSectionModel) {
        throw new Error('Updated magazine section not found');
      }

      expect(updatedMagazineSectionModel).toBeDefined();
      expect(updatedMagazineSectionModel.idx).toBe(magazineSectionSeed.idx);
      expect(updatedMagazineSectionModel.title).toBe(updateDto.title);
      expect(updatedMagazineSectionModel.parameter).toEqual(
        updateDto.parameter,
      );
      expect(updatedMagazineSectionModel.sortOrder).toBe(
        magazineSectionSeed.sortOrder,
      );
    });

    it('200 - successfully update magazine section only title and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Original Magazine Section Title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdateMagazineSectionDto = {
        title: 'Updated Magazine Section Title',
        parameter: magazineSectionSeed.parameter,
      };

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedMagazineSectionModel = await testHelper
        .get(MagazineSectionCoreService)
        .getMagazineSectionByIdx(magazineSectionSeed.idx);

      if (!updatedMagazineSectionModel) {
        throw new Error('Updated magazine section not found');
      }

      expect(updatedMagazineSectionModel).toBeDefined();
      expect(updatedMagazineSectionModel.idx).toBe(magazineSectionSeed.idx);
      expect(updatedMagazineSectionModel.title).toBe(updateDto.title);
      expect(updatedMagazineSectionModel.parameter).toEqual(
        magazineSectionSeed.parameter,
      );
      expect(updatedMagazineSectionModel.sortOrder).toBe(
        magazineSectionSeed.sortOrder,
      );
    });

    it('200 - successfully update magazine section only parameter and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Original Magazine Section Title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdateMagazineSectionDto = {
        title: magazineSectionSeed.title,
        parameter: {
          orderBy: 'like',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedMagazineSectionModel = await testHelper
        .get(MagazineSectionCoreService)
        .getMagazineSectionByIdx(magazineSectionSeed.idx);

      if (!updatedMagazineSectionModel) {
        throw new Error('Updated magazine section not found');
      }

      expect(updatedMagazineSectionModel).toBeDefined();
      expect(updatedMagazineSectionModel.idx).toBe(magazineSectionSeed.idx);
      expect(updatedMagazineSectionModel.title).toBe(magazineSectionSeed.title);
      expect(updatedMagazineSectionModel.parameter).toEqual(
        updateDto.parameter,
      );
      expect(updatedMagazineSectionModel.sortOrder).toBe(
        magazineSectionSeed.sortOrder,
      );
    });

    it('400 - invalid parameter', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Original Magazine Section Title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const invalidUpdateDto = {
        title: 'Updated Magazine Section Title',
        parameter: {
          orderBy: 'invalid_order_by',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidUpdateDto)
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Original Magazine Section Title',
        parameter: {
          orderBy: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdateMagazineSectionDto = {
        title: 'Updated Magazine Section Title',
        parameter: {
          orderBy: 'like',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateDto)
        .expect(403);
    });

    it('404 - magazine section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      const updateDto: UpdateMagazineSectionDto = {
        title: 'Updated Magazine Section Title',
        parameter: {
          orderBy: 'like',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/magazine-section/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('PUT /magazine-section/:idx/sort-order', () => {
    it('200 - successfully update magazine section sort order in left between place sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed2.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order in left between magazine sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed3.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order in left between place section and magazine section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);
      expect(magazineSectionSeed1.sortOrder).toBe(2);
      expect(magazineSectionSeed2.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed2.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order to first order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);
      expect(magazineSectionSeed1.sortOrder).toBe(2);
      expect(magazineSectionSeed2.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed2.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 1 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order in right between place sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(placeSectionSeed1.sortOrder).toBe(3);
      expect(placeSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 3 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('MAGAZINE');
      expect(allSectionList[3].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order in right between magazine sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update magazine section sort order to last order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('400 - invalid sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section',
        deletedAt: null,
      });

      expect(magazineSectionSeed.sortOrder).toBe(1);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 0 })
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section',
        deletedAt: null,
      });

      expect(magazineSectionSeed.sortOrder).toBe(1);

      await testHelper
        .test()
        .put(`/magazine-section/${magazineSectionSeed.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 1 })
        .expect(403);
    });

    it('404 - magazine section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      await testHelper
        .test()
        .put(`/magazine-section/${nonExistentIdx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 1 })
        .expect(404);
    });
  });

  describe('DELETE /magazine-section/:idx', () => {
    it('200 - successfully delete magazine section between place sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const placeSectionSeed3 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed.sortOrder).toBe(2);
      expect(placeSectionSeed2.sortOrder).toBe(3);
      expect(placeSectionSeed3.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed3.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully delete magazine section between magazine sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });
      const magazineSectionSeed4 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 4',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);
      expect(magazineSectionSeed4.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed4.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully delete magazine section in first order and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed1.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('200 - successfully delete magazine section in last order and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed3.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const magazineSectionSeed = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section',
        deletedAt: null,
      });

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });

    it('404 - magazine section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      await testHelper
        .test()
        .delete(`/magazine-section/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  // place-section

  describe('POST /place-section', () => {
    it('200 - successfully create place section and field check', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto: CreatePlaceSectionDto = {
        title: 'Test place section title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const placeSection: PlaceSectionEntity = response.body;

      expect(placeSection).toBeDefined();
      expect(placeSection.idx).toBeDefined();
      expect(placeSection.title).toBe(createDto.title);
      expect(placeSection.parameter).toEqual(createDto.parameter);
      expect(placeSection.sortOrder).toBe(1);
      expect(placeSection.createdAt).toBeDefined();
    });

    it('200 - successfully create place section (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const createDto = {
        title: 'Test place section title',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createDto)
        .expect(201);

      const placeSection: PlaceSectionEntity = response.body;

      expect(placeSection).toBeDefined();
      expect(placeSection.idx).toBeDefined();
      expect(placeSection.title).toBe(createDto.title);
    });

    it('200 - successfully create place section (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto = {
        title: 'Test place section title',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const placeSection: PlaceSectionEntity = response.body;

      expect(placeSection).toBeDefined();
      expect(placeSection.idx).toBeDefined();
      expect(placeSection.title).toBe(createDto.title);
    });

    it('200 - successfully create place section with existing place/magazine sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await placeSectionSeedHelper.seedAll([
        {
          title: 'Existing Place Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Place Section 2',
          deletedAt: null,
        },
      ]);

      await magazineSectionSeedHelper.seedAll([
        {
          title: 'Existing Magazine Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Magazine Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newPlaceSection: PlaceSectionEntity = response.body;

      expect(newPlaceSection).toBeDefined();
      expect(newPlaceSection.idx).toBeDefined();
      expect(newPlaceSection.title).toBe(createDto.title);
      expect(newPlaceSection.sortOrder).toBe(5);
    });

    it('200 - successfully create place section with existing place sections but no magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await placeSectionSeedHelper.seedAll([
        {
          title: 'Existing Place Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Place Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newPlaceSection: PlaceSectionEntity = response.body;

      expect(newPlaceSection).toBeDefined();
      expect(newPlaceSection.idx).toBeDefined();
      expect(newPlaceSection.title).toBe(createDto.title);
      expect(newPlaceSection.sortOrder).toBe(3);
    });

    it('200 - successfully create place section with existing magazine sections but no place section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await magazineSectionSeedHelper.seedAll([
        {
          title: 'Existing Magazine Section 1',
          deletedAt: null,
        },
        {
          title: 'Existing Magazine Section 2',
          deletedAt: null,
        },
      ]);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newPlaceSection: PlaceSectionEntity = response.body;

      expect(newPlaceSection).toBeDefined();
      expect(newPlaceSection.idx).toBeDefined();
      expect(newPlaceSection.title).toBe(createDto.title);
      expect(newPlaceSection.sortOrder).toBe(3);
    });

    it('200 - successfully create place section with no existing place/magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      const response = await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const newPlaceSection: PlaceSectionEntity = response.body;

      expect(newPlaceSection).toBeDefined();
      expect(newPlaceSection.idx).toBeDefined();
      expect(newPlaceSection.title).toBe(createDto.title);
      expect(newPlaceSection.sortOrder).toBe(1);
    });

    it('200 - successfully create place section with existing place/magazine sections after deleting magazine section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed1.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully create place section with existing place/magazine sections after deleting place section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully create place section with existing place section but no existing magazine section after deleting place section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].sortOrder).toBe(1);
      expect(allSectionList[1].idx).toBe(placeSectionSeed1.idx);
    });

    it('200 - successfully create place section with existing magazine section but no existing place section after deleting magazine section and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .delete(`/magazine-section/${magazineSectionSeed2.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const createDto = {
        title: 'New Place Section',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createDto)
        .expect(201);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].title).toBe(createDto.title);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('400 - invalid parameter', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const invalidCreateDto = {
        title: 'Test place section title',
        parameter: {
          orderby: 'invalid_order_by',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidCreateDto)
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const createDto = {
        title: 'Test place section title',
        parameter: {
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
      };

      await testHelper
        .test()
        .post('/place-section')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(createDto)
        .expect(403);
    });
  });

  describe('PUT /place-section/:idx', () => {
    it('200 - successfully update place section and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Original Place Section Title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdatePlaceSectionDto = {
        title: 'Updated Place Section Title',
        parameter: {
          order: 'asc',
          orderby: 'review',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedPlaceSectionModel = await testHelper
        .get(PlaceSectionCoreService)
        .getPlaceSectionByIdx(placeSectionSeed.idx);

      if (!updatedPlaceSectionModel) {
        throw new Error('Updated place section not found');
      }

      expect(updatedPlaceSectionModel).toBeDefined();
      expect(updatedPlaceSectionModel.idx).toBe(placeSectionSeed.idx);
      expect(updatedPlaceSectionModel.title).toBe(updateDto.title);
      expect(updatedPlaceSectionModel.parameter).toEqual(updateDto.parameter);
      expect(updatedPlaceSectionModel.sortOrder).toBe(
        placeSectionSeed.sortOrder,
      );
    });

    it('200 - successfully update place section only title and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Original Place Section Title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdatePlaceSectionDto = {
        title: 'Updated Place Section Title',
        parameter: placeSectionSeed.parameter,
      };

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedPlaceSectionModel = await testHelper
        .get(PlaceSectionCoreService)
        .getPlaceSectionByIdx(placeSectionSeed.idx);

      if (!updatedPlaceSectionModel) {
        throw new Error('Updated place section not found');
      }

      expect(updatedPlaceSectionModel).toBeDefined();
      expect(updatedPlaceSectionModel.idx).toBe(placeSectionSeed.idx);
      expect(updatedPlaceSectionModel.title).toBe(updateDto.title);
      expect(updatedPlaceSectionModel.parameter).toEqual(
        placeSectionSeed.parameter,
      );
      expect(updatedPlaceSectionModel.sortOrder).toBe(
        placeSectionSeed.sortOrder,
      );
    });

    it('200 - successfully update place section only parameter and check updated fields', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Original Place Section Title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdatePlaceSectionDto = {
        title: placeSectionSeed.title,
        parameter: {
          order: 'asc',
          orderby: 'review',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(200);

      const updatedPlaceSectionModel = await testHelper
        .get(PlaceSectionCoreService)
        .getPlaceSectionByIdx(placeSectionSeed.idx);

      if (!updatedPlaceSectionModel) {
        throw new Error('Updated place section not found');
      }

      expect(updatedPlaceSectionModel).toBeDefined();
      expect(updatedPlaceSectionModel.idx).toBe(placeSectionSeed.idx);
      expect(updatedPlaceSectionModel.title).toBe(placeSectionSeed.title);
      expect(updatedPlaceSectionModel.parameter).toEqual(updateDto.parameter);
      expect(updatedPlaceSectionModel.sortOrder).toBe(
        placeSectionSeed.sortOrder,
      );
    });

    it('400 - invalid parameter', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Original Place Section Title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const invalidUpdateDto = {
        title: 'Updated Place Section Title',
        parameter: {
          order: 'invalid_order',
          orderby: 'invalid_order_by',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(invalidUpdateDto)
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Original Place Section Title',
        parameter: {
          order: 'desc',
          orderby: 'time',
          type: 1,
          mainCategoryList: [1],
          moodCategoryList: [1],
        },
        deletedAt: null,
      });

      const updateDto: UpdatePlaceSectionDto = {
        title: 'Updated Place Section Title',
        parameter: {
          order: 'asc',
          orderby: 'review',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(updateDto)
        .expect(403);
    });

    it('404 - place section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      const updateDto: UpdatePlaceSectionDto = {
        title: 'Updated Place Section Title',
        parameter: {
          order: 'asc',
          orderby: 'review',
          type: 2,
          mainCategoryList: [2],
          moodCategoryList: [2],
        },
      };

      await testHelper
        .test()
        .put(`/place-section/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('PUT /place-section/:idx/sort-order', () => {
    it('200 - successfully update place section sort order in left between place sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const placeSectionSeed3 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(placeSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed3.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed3.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order in left between magazine sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(placeSectionSeed.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order in left between place section and magazine section', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);
      expect(magazineSectionSeed1.sortOrder).toBe(2);
      expect(placeSectionSeed2.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed2.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order to first order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);
      expect(magazineSectionSeed1.sortOrder).toBe(2);
      expect(placeSectionSeed2.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed2.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 1 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order in right between place sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed1.sortOrder).toBe(3);
      expect(magazineSectionSeed2.sortOrder).toBe(4);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 3 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(4);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(3);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(2);
      expect(allSectionList[3].type).toBe('PLACE');
      expect(allSectionList[3].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[3].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order in right between magazine sections', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully update place section sort order to last order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const magazineSectionSeed2 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 2',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(magazineSectionSeed2.sortOrder).toBe(2);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed1.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 2 })
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('400 - invalid sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 0 })
        .expect(400);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      expect(placeSectionSeed.sortOrder).toBe(1);

      await testHelper
        .test()
        .put(`/place-section/${placeSectionSeed.idx}/sort-order`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send({ sortOrder: 1 })
        .expect(403);
    });

    it('404 - place section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      await testHelper
        .test()
        .put(`/place-section/${nonExistentIdx}/sort-order`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ sortOrder: 1 })
        .expect(404);
    });
  });

  describe('DELETE /place-section/:idx', () => {
    it('200 - successfully delete place section between place sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const placeSectionSeed3 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed.sortOrder).toBe(2);
      expect(placeSectionSeed2.sortOrder).toBe(3);
      expect(placeSectionSeed3.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed3.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('PLACE');
      expect(allSectionList[2].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully delete place section between magazine sections and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const magazineSectionSeed1 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 1',
        deletedAt: null,
      });
      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const magazineSectionSeed3 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 3',
        deletedAt: null,
      });
      const magazineSectionSeed4 = await magazineSectionSeedHelper.seed({
        title: 'Existing Magazine Section 4',
        deletedAt: null,
      });

      expect(magazineSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed.sortOrder).toBe(2);
      expect(magazineSectionSeed3.sortOrder).toBe(3);
      expect(magazineSectionSeed4.sortOrder).toBe(4);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('MAGAZINE');
      expect(allSectionList[0].idx).toBe(magazineSectionSeed4.idx);
      expect(allSectionList[0].sortOrder).toBe(3);
      expect(allSectionList[1].type).toBe('MAGAZINE');
      expect(allSectionList[1].idx).toBe(magazineSectionSeed3.idx);
      expect(allSectionList[1].sortOrder).toBe(2);
      expect(allSectionList[2].type).toBe('MAGAZINE');
      expect(allSectionList[2].idx).toBe(magazineSectionSeed1.idx);
      expect(allSectionList[2].sortOrder).toBe(1);
    });

    it('200 - successfully delete place section in first order and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const placeSectionSeed3 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(placeSectionSeed3.sortOrder).toBe(3);

      // GET /place-section/:idx API가 삭제됨에 따라서 주석 처리
      // await testHelper
      //   .test()
      //   .delete(`/place-section/${placeSectionSeed1.idx}`)
      //   .set('Cookie', `token=Bearer ${admin.token}`)
      //   .expect(200);

      // const allSectionResponse = await testHelper
      //   .test()
      //   .get('/section/all')
      //   .set('Cookie', `token=Bearer ${admin.token}`)
      //   .expect(200);
      // const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
      //   allSectionResponse.body.combinedSectionList;

      // expect(allSectionList[0].type).toBe('PLACE');
      // expect(allSectionList[0].idx).toBe(placeSectionSeed3.idx);
      // expect(allSectionList[0].sortOrder).toBe(2);
      // expect(allSectionList[1].type).toBe('PLACE');
      // expect(allSectionList[1].idx).toBe(placeSectionSeed2.idx);
      // expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('200 - successfully delete place section in last order and check sort order', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const placeSectionSeed1 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 1',
        deletedAt: null,
      });
      const placeSectionSeed2 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 2',
        deletedAt: null,
      });
      const placeSectionSeed3 = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section 3',
        deletedAt: null,
      });

      expect(placeSectionSeed1.sortOrder).toBe(1);
      expect(placeSectionSeed2.sortOrder).toBe(2);
      expect(placeSectionSeed3.sortOrder).toBe(3);

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed3.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const allSectionResponse = await testHelper
        .test()
        .get('/section/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);
      const allSectionList: (PlaceSectionItem | MagazineSectionItem)[] =
        allSectionResponse.body.combinedSectionList;

      expect(allSectionList[0].type).toBe('PLACE');
      expect(allSectionList[0].idx).toBe(placeSectionSeed2.idx);
      expect(allSectionList[0].sortOrder).toBe(2);
      expect(allSectionList[1].type).toBe('PLACE');
      expect(allSectionList[1].idx).toBe(placeSectionSeed1.idx);
      expect(allSectionList[1].sortOrder).toBe(1);
    });

    it('403 - unauthorized access', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const placeSectionSeed = await placeSectionSeedHelper.seed({
        title: 'Existing Place Section',
        deletedAt: null,
      });

      await testHelper
        .test()
        .delete(`/place-section/${placeSectionSeed.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });

    it('404 - place section not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const nonExistentIdx = 9999;

      await testHelper
        .test()
        .delete(`/place-section/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
