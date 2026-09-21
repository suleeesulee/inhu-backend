import { AdminServerModule } from '@admin/admin-server.module';
import { NfcEntity } from '@admin/api/nfc/entity/nfc.entity';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { TestHelper } from '../../setup/test.helper';

describe('Nfc E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /nfc/all', () => {
    it('200 - returns nfc from all places without activated filter', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstPlace, secondPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [activatedNfc, deactivatedNfc, deletedNfc] =
        await nfcSeedHelper.seedAll([
          {
            placeIdx: firstPlace.idx,
            score: 3,
            uid: '04DE5F1EACC001',
            activatedAt: new Date(),
          },
          {
            placeIdx: secondPlace.idx,
            score: 5,
            uid: '04DE5F1EACC002',
            activatedAt: null,
          },
          {
            placeIdx: firstPlace.idx,
            score: 7,
            uid: '04DE5F1EACC003',
            activatedAt: new Date(),
            deletedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      const nfcList: NfcEntity[] = response.body.nfcList;
      const nfcIdxList = nfcList.map((nfc) => nfc.idx);

      expect(response.body.count).toBe(2);
      expect(nfcList).toHaveLength(2);
      expect(nfcIdxList).toEqual(
        expect.arrayContaining([activatedNfc.idx, deactivatedNfc.idx]),
      );
      expect(nfcIdxList).not.toContain(deletedNfc.idx);
      expect(nfcList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            idx: activatedNfc.idx,
            placeIdx: firstPlace.idx,
            score: activatedNfc.score,
            uid: activatedNfc.uid,
          }),
          expect.objectContaining({
            idx: deactivatedNfc.idx,
            placeIdx: secondPlace.idx,
            score: deactivatedNfc.score,
            uid: deactivatedNfc.uid,
            activatedAt: null,
          }),
        ]),
      );
      expect(nfcList[0].createdAt).toBeDefined();
    });

    it('200 - activated filter check across different places', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [firstPlace, secondPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [activatedNfc, deactivatedNfc] = await nfcSeedHelper.seedAll([
        {
          placeIdx: firstPlace.idx,
          uid: '04DE5F1EACC004',
          activatedAt: new Date(),
        },
        {
          placeIdx: secondPlace.idx,
          uid: '04DE5F1EACC005',
          activatedAt: null,
        },
      ]);

      const activatedResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: true })
        .expect(200);
      const deactivatedResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: false })
        .expect(200);

      expect(activatedResponse.body.nfcList).toHaveLength(1);
      expect(activatedResponse.body.nfcList[0].idx).toBe(activatedNfc.idx);
      expect(deactivatedResponse.body.nfcList).toHaveLength(1);
      expect(deactivatedResponse.body.nfcList[0].idx).toBe(deactivatedNfc.idx);
    });

    it('200 - place filter returns only nfc mapped to requested place', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [targetPlace, otherPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [firstNfc, secondNfc, deletedNfc, otherPlaceNfc] =
        await nfcSeedHelper.seedAll([
          {
            placeIdx: targetPlace.idx,
            score: 3,
            uid: '04DE5F1EACC041',
            activatedAt: new Date(),
          },
          {
            placeIdx: targetPlace.idx,
            score: 5,
            uid: '04DE5F1EACC042',
            activatedAt: null,
          },
          {
            placeIdx: targetPlace.idx,
            score: 7,
            uid: '04DE5F1EACC043',
            deletedAt: new Date(),
          },
          {
            placeIdx: otherPlace.idx,
            score: 9,
            uid: '04DE5F1EACC044',
            activatedAt: new Date(),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: targetPlace.idx })
        .expect(200);

      const nfcList: NfcEntity[] = response.body.nfcList;
      const nfcIdxList = nfcList.map((nfc) => nfc.idx);

      expect(response.body.count).toBe(2);
      expect(nfcIdxList).toEqual(
        expect.arrayContaining([firstNfc.idx, secondNfc.idx]),
      );
      expect(nfcIdxList).not.toContain(deletedNfc.idx);
      expect(nfcIdxList).not.toContain(otherPlaceNfc.idx);
      expect(nfcList).toHaveLength(2);
    });

    it('200 - place and activated filters are applied together', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [targetPlace, otherPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [targetActivatedNfc] = await nfcSeedHelper.seedAll([
        {
          placeIdx: targetPlace.idx,
          uid: '04DE5F1EACC045',
          activatedAt: new Date(),
        },
        {
          placeIdx: targetPlace.idx,
          uid: '04DE5F1EACC046',
          activatedAt: null,
        },
        {
          placeIdx: otherPlace.idx,
          uid: '04DE5F1EACC047',
          activatedAt: new Date(),
        },
      ]);

      const response = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: targetPlace.idx, activated: true })
        .expect(200);

      expect(response.body.nfcList).toHaveLength(1);
      expect(response.body.nfcList[0].idx).toBe(targetActivatedNfc.idx);
    });

    it('200 - returns empty list when requested place has no nfc', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: place.idx })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.nfcList).toEqual([]);
    });

    it('200 - pagination check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      await nfcSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          placeIdx: place.idx,
          score: index,
          uid: `04${index.toString(16).toUpperCase().padStart(12, '0')}`,
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 2 })
        .expect(200);

      expect(firstPageResponse.body.count).toBe(11);
      expect(firstPageResponse.body.nfcList).toHaveLength(10);
      expect(secondPageResponse.body.count).toBe(11);
      expect(secondPageResponse.body.nfcList).toHaveLength(1);
    });

    it('200 - order check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const [olderNfc, newerNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, uid: '04DE5F1EACC006' },
        { placeIdx: place.idx, uid: '04DE5F1EACC007' },
      ]);
      await testHelper.getPrisma().nfc.update({
        where: { idx: olderNfc.idx },
        data: { createdAt: new Date('2026-01-01T00:00:00.000Z') },
      });
      await testHelper.getPrisma().nfc.update({
        where: { idx: newerNfc.idx },
        data: { createdAt: new Date('2026-01-02T00:00:00.000Z') },
      });

      const ascendingResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'asc' })
        .expect(200);
      const descendingResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'desc' })
        .expect(200);

      expect(ascendingResponse.body.nfcList[0].idx).toBe(olderNfc.idx);
      expect(descendingResponse.body.nfcList[0].idx).toBe(newerNfc.idx);
    });

    it('200 - returns empty list when nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1 })
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.nfcList).toEqual([]);
    });

    it('400 - page is missing', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('400 - page is less than one', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 0 })
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, order: 'invalid-order' })
        .expect(400);
    });

    it('400 - activated is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, activated: 'invalid-activated' })
        .expect(400);
    });

    it('400 - place is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: 'invalid-place' })
        .expect(400);
    });

    it('400 - place is less than one', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: 0 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/nfc/all').query({ page: 1 }).expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .query({ page: 1 })
        .expect(403);
    });
  });

  describe('GET /nfc/:idx', () => {
    it('200 - inactive nfc field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 10,
        uid: '04DE5F1EACC040',
        activatedAt: null,
      });

      const response = await testHelper
        .test()
        .get(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const nfc: NfcEntity = response.body;

      expect(nfc.idx).toBe(nfcSeed.idx);
      expect(nfc.placeIdx).toBe(place.idx);
      expect(nfc.score).toBe(nfcSeed.score);
      expect(nfc.uid).toBe(nfcSeed.uid);
      expect(nfc.activatedAt).toBeNull();
      expect(nfc.createdAt).toBeDefined();
    });

    it('400 - nfc idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/invalid-nfc-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().get('/nfc/1').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .get('/nfc/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .get('/nfc/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('404 - nfc has been deleted', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        deletedAt: new Date(),
      });

      await testHelper
        .test()
        .get(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });

  describe('POST /place/:placeIdx/nfc', () => {
    it('201 - creates inactive nfc with default cooldown', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}/nfc`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 0, uid: '04de5f1eacc045' })
        .expect(201);

      const nfc: NfcEntity = response.body;

      expect(nfc.idx).toBeDefined();
      expect(nfc.placeIdx).toBe(place.idx);
      expect(nfc.score).toBe(0);
      expect(nfc.uid).toBe('04DE5F1EACC045');
      expect(nfc.cooldown).toBeNull();
      expect(nfc.activatedAt).toBeNull();
      expect(nfc.createdAt).toBeDefined();
    });

    it('201 - creates nfc with cooldown', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      const response = await testHelper
        .test()
        .post(`/place/${place.idx}/nfc`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC060', cooldown: 60 })
        .expect(201);

      expect(response.body.cooldown).toBe(60);
    });

    it('400 - nfc score is negative', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      await testHelper
        .test()
        .post(`/place/${place.idx}/nfc`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: -1, uid: '04DE5F1EACC046' })
        .expect(400);
    });

    it('400 - nfc uid is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      await testHelper
        .test()
        .post(`/place/${place.idx}/nfc`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: 'invalid-nfc-uid' })
        .expect(400);
    });

    it('400 - place idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/place/invalid-place-idx/nfc')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC047' })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post('/place/1/nfc')
        .send({ score: 1, uid: '04DE5F1EACC048' })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const place = await placeSeedHelper.seed({});

      await testHelper
        .test()
        .post(`/place/${place.idx}/nfc`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC049' })
        .expect(403);
    });
  });

  describe('PUT /nfc/:idx', () => {
    it('200 - updates score without changing uid or activation state', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const activatedAt = new Date('2026-08-01T00:00:00.000Z');
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 3,
        uid: '04DE5F1EACC050',
        cooldown: 30,
        activatedAt,
      });

      await testHelper
        .test()
        .put(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 10, uid: nfcSeed.uid })
        .expect(200);

      const nfc = await testHelper.getPrisma().nfc.findUniqueOrThrow({
        where: { idx: nfcSeed.idx },
      });

      expect(nfc.score).toBe(10);
      expect(nfc.uid).toBe(nfcSeed.uid);
      expect(nfc.cooldown).toBe(30);
      expect(nfc.activatedAt).toEqual(activatedAt);
    });

    it('200 - changing uid deactivates nfc', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        score: 3,
        uid: '04DE5F1EACC051',
        cooldown: 30,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .put(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 7, uid: '04DE5F1EACC052', cooldown: 60 })
        .expect(200);

      const nfc = await testHelper.getPrisma().nfc.findUniqueOrThrow({
        where: { idx: nfcSeed.idx },
      });

      expect(nfc.score).toBe(7);
      expect(nfc.uid).toBe('04DE5F1EACC052');
      expect(nfc.cooldown).toBe(60);
      expect(nfc.activatedAt).toBeNull();
    });

    it('200 - null cooldown applies the default cooldown', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: '04DE5F1EACC061',
        cooldown: 30,
      });

      await testHelper
        .test()
        .put(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 3, uid: nfcSeed.uid, cooldown: null })
        .expect(200);

      await expect(
        testHelper.getPrisma().nfc.findUniqueOrThrow({
          where: { idx: nfcSeed.idx },
        }),
      ).resolves.toEqual(expect.objectContaining({ cooldown: null }));
    });

    it('400 - nfc idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/nfc/invalid-nfc-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC053' })
        .expect(400);
    });

    it('400 - nfc uid is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({ placeIdx: place.idx });

      await testHelper
        .test()
        .put(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: 'invalid-nfc-uid' })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put('/nfc/1')
        .send({ score: 1, uid: '04DE5F1EACC054' })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/nfc/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC055' })
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/nfc/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ score: 1, uid: '04DE5F1EACC056' })
        .expect(404);
    });
  });

  describe('PUT /place/:placeIdx/nfc/all', () => {
    it('200 - updates cooldown for every nfc in the place only', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const [targetPlace, otherPlace] = await placeSeedHelper.seedAll([{}, {}]);
      const [firstNfc, secondNfc, otherNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: targetPlace.idx, cooldown: 30 },
        { placeIdx: targetPlace.idx, cooldown: 30 },
        { placeIdx: otherPlace.idx, cooldown: 30 },
      ]);

      await testHelper
        .test()
        .put(`/place/${targetPlace.idx}/nfc/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ cooldown: 120 })
        .expect(200);

      const nfcList = await testHelper.getPrisma().nfc.findMany({
        where: { idx: { in: [firstNfc.idx, secondNfc.idx, otherNfc.idx] } },
        orderBy: { idx: 'asc' },
      });

      expect(nfcList.map(({ cooldown }) => cooldown)).toStrictEqual([
        120, 120, 30,
      ]);
    });

    it('400 - cooldown is negative', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});

      await testHelper
        .test()
        .put(`/place/${place.idx}/nfc/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ cooldown: -1 })
        .expect(400);
    });

    it('200 - null cooldown applies the default cooldown to every nfc', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcList = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, cooldown: 30 },
        { placeIdx: place.idx, cooldown: 60 },
      ]);

      await testHelper
        .test()
        .put(`/place/${place.idx}/nfc/all`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ cooldown: null })
        .expect(200);

      const updatedNfcList = await testHelper.getPrisma().nfc.findMany({
        where: { idx: { in: nfcList.map(({ idx }) => idx) } },
      });

      expect(updatedNfcList.map(({ cooldown }) => cooldown)).toEqual([
        null,
        null,
      ]);
    });

    it('400 - place idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/place/invalid-place-idx/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ cooldown: 60 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .put('/place/1/nfc/all')
        .send({ cooldown: 60 })
        .expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .put('/place/1/nfc/all')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send({ cooldown: 60 })
        .expect(403);
    });

    it('404 - place does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .put('/place/999999/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send({ cooldown: 60 })
        .expect(404);
    });
  });

  describe('POST /nfc/:idx/activate', () => {
    it('201 - activates inactive nfc', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: null,
      });
      const beforeRequest = new Date();

      await testHelper
        .test()
        .post(`/nfc/${nfcSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(201);

      const nfc = await testHelper.getPrisma().nfc.findUniqueOrThrow({
        where: { idx: nfcSeed.idx },
      });

      expect(nfc.activatedAt).not.toBeNull();
      expect(nfc.activatedAt?.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
    });

    it('400 - nfc idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/nfc/invalid-nfc-idx/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/nfc/1/activate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/nfc/1/activate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/nfc/999999/activate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - nfc has already been activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/nfc/${nfcSeed.idx}/activate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });

  describe('POST /nfc/:idx/deactivate', () => {
    it('201 - deactivates active nfc', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post(`/nfc/${nfcSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(201);

      const nfc = await testHelper.getPrisma().nfc.findUniqueOrThrow({
        where: { idx: nfcSeed.idx },
      });

      expect(nfc.activatedAt).toBeNull();
    });

    it('400 - nfc idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/nfc/invalid-nfc-idx/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().post('/nfc/1/deactivate').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .post('/nfc/1/deactivate')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .post('/nfc/999999/deactivate')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('409 - nfc is not activated', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: null,
      });

      await testHelper
        .test()
        .post(`/nfc/${nfcSeed.idx}/deactivate`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(409);
    });
  });

  describe('DELETE /nfc/:idx', () => {
    it('200 - soft deletes nfc and excludes it from filtered nfc list', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const place = await placeSeedHelper.seed({});
      const nfcSeed = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .delete(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const nfc = await testHelper.getPrisma().nfc.findUniqueOrThrow({
        where: { idx: nfcSeed.idx },
      });
      const nfcListResponse = await testHelper
        .test()
        .get('/nfc/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .query({ page: 1, place: place.idx })
        .expect(200);

      expect(nfc.deletedAt).not.toBeNull();
      expect(nfcListResponse.body.count).toBe(0);
      expect(nfcListResponse.body.nfcList).toEqual([]);

      await testHelper
        .test()
        .get(`/nfc/${nfcSeed.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });

    it('400 - nfc idx is invalid', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/nfc/invalid-nfc-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper.test().delete('/nfc/1').expect(401);
    });

    it('403 - insufficient role', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .delete('/nfc/1')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/nfc/999999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
