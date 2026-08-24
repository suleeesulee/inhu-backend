import {
  calculateNfcMac,
  deriveNfcFileReadKey,
  deriveNfcMetaReadKey,
  deriveNfcSessionMacKey,
} from '@libs/core/nfc/nfc-crypto';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { PlaceVisitSeedHelper } from '@libs/testing/seed/place-visit/place-visit.seed';
import { AppModule } from '@user/app.module';
import { PlaceVisitEntity } from '@user/api/place-visit/entity/place-visit.entity';
import { createCipheriv } from 'crypto';
import { TestHelper } from '../../setup/test.helper';

describe('Place Visit E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
  const placeVisitSeedHelper = testHelper.seedHelper(PlaceVisitSeedHelper);
  const masterKey = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
  const uid = Buffer.from('04A1B2C3D4E5F6', 'hex');
  const readCounter = Buffer.from('000001', 'hex');
  const latitude = 37.4508371;
  const longitude = 126.6531324;
  let piccData: string;
  let cmac: string;

  beforeEach(async () => {
    await testHelper.init();

    const cipher = createCipheriv(
      'aes-128-cbc',
      deriveNfcMetaReadKey(masterKey),
      Buffer.alloc(16),
    );
    cipher.setAutoPadding(false);

    piccData = Buffer.concat([
      cipher.update(
        Buffer.concat([Buffer.from([0xc7]), uid, readCounter, Buffer.alloc(5)]),
      ),
      cipher.final(),
    ])
      .toString('hex')
      .toUpperCase();
    cmac = calculateNfcMac(
      deriveNfcSessionMacKey(
        deriveNfcFileReadKey(masterKey, uid),
        uid,
        readCounter,
      ),
    )
      .toString('hex')
      .toUpperCase();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /place-visit/all', () => {
    it('200 - get only login user place visits and exclude deleted place', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const otherUser = testHelper.loginUsers.user2;
      const [place, deletedPlace] = await placeSeedHelper.seedAll([
        { name: '방문 인증 장소', activatedAt: new Date() },
        {
          name: '삭제된 방문 인증 장소',
          activatedAt: new Date(),
          deletedAt: new Date(),
        },
      ]);
      const [nfc, deletedPlaceNfc] = await nfcSeedHelper.seedAll([
        { placeIdx: place.idx, score: 7, activatedAt: new Date() },
        { placeIdx: deletedPlace.idx, score: 9, activatedAt: new Date() },
      ]);
      const [olderPlaceVisit, latestPlaceVisit, otherUserPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: loginUser.idx,
            nfcIdx: nfc.idx,
            score: 3,
            latitude: 37.4508371,
            longitude: 126.6531324,
            createdAt: new Date('2026-08-01T10:00:00.000Z'),
          },
          {
            userIdx: loginUser.idx,
            nfcIdx: nfc.idx,
            score: 7,
            latitude: 37.4511111,
            longitude: 126.6542222,
            createdAt: new Date('2026-08-02T10:00:00.000Z'),
          },
          {
            userIdx: otherUser.idx,
            nfcIdx: nfc.idx,
            createdAt: new Date('2026-08-03T10:00:00.000Z'),
          },
        ]);
      const deletedPlaceVisit = await placeVisitSeedHelper.seed({
        userIdx: loginUser.idx,
        nfcIdx: deletedPlaceNfc.idx,
        createdAt: new Date('2026-08-04T10:00:00.000Z'),
      });

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const placeVisitList: PlaceVisitEntity[] = response.body.placeVisitList;

      expect(response.body.hasNext).toBe(false);
      expect(placeVisitList).toHaveLength(2);
      expect(placeVisitList.map(({ id }) => id)).toStrictEqual([
        latestPlaceVisit.id,
        olderPlaceVisit.id,
      ]);
      expect(
        placeVisitList.some(({ id }) => id === otherUserPlaceVisit.id),
      ).toBe(false);
      expect(placeVisitList.some(({ id }) => id === deletedPlaceVisit.id)).toBe(
        false,
      );
      expect(placeVisitList[0]).toEqual(
        expect.objectContaining({
          id: latestPlaceVisit.id,
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: 7,
          latitude: 37.4511111,
          longitude: 126.6542222,
          place: expect.objectContaining({
            idx: place.idx,
            name: place.name,
          }),
          createdAt: latestPlaceVisit.createdAt.toISOString(),
        }),
      );
    });

    it('200 - ascending order check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: new Date(),
      });
      const [olderPlaceVisit, latestPlaceVisit] =
        await placeVisitSeedHelper.seedAll([
          {
            userIdx: loginUser.idx,
            nfcIdx: nfc.idx,
            createdAt: new Date('2026-08-01T10:00:00.000Z'),
          },
          {
            userIdx: loginUser.idx,
            nfcIdx: nfc.idx,
            createdAt: new Date('2026-08-02T10:00:00.000Z'),
          },
        ]);

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1, order: 'asc' })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const placeVisitList: PlaceVisitEntity[] = response.body.placeVisitList;

      expect(response.body.hasNext).toBe(false);
      expect(placeVisitList.map(({ id }) => id)).toStrictEqual([
        olderPlaceVisit.id,
        latestPlaceVisit.id,
      ]);
    });

    it('200 - pagination check', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        activatedAt: new Date(),
      });
      const placeVisitList = await placeVisitSeedHelper.seedAll(
        Array.from({ length: 11 }, (_, index) => ({
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          createdAt: new Date(Date.UTC(2026, 7, index + 1)),
        })),
      );

      const firstPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);
      const secondPageResponse = await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 2 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      expect(firstPageResponse.body.hasNext).toBe(true);
      expect(firstPageResponse.body.placeVisitList).toHaveLength(10);
      expect(secondPageResponse.body.hasNext).toBe(false);
      expect(secondPageResponse.body.placeVisitList).toHaveLength(1);
      expect(secondPageResponse.body.placeVisitList[0].id).toBe(
        placeVisitList[0].id,
      );
    });

    it('200 - returns empty list when place visits do not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      const response = await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({
        hasNext: false,
        placeVisitList: [],
      });
    });

    it('400 - page is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('400 - page is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 0 })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('400 - order is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1, order: 'latest' })
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .get('/place-visit/all')
        .query({ page: 1 })
        .expect(401);
    });
  });

  describe('POST /place-visit/nfc', () => {
    it('201 - create place visit and persist NFC score', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({
        name: 'NFC 방문 인증 장소',
        activatedAt: new Date(),
      });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: uid.toString('hex').toUpperCase(),
        score: 7,
        activatedAt: new Date(),
      });
      const beforeRequest = new Date();

      const response = await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude, longitude })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          latitude,
          longitude,
          place: expect.objectContaining({
            idx: place.idx,
            name: 'NFC 방문 인증 장소',
          }),
          createdAt: expect.any(String),
        }),
      );

      const placeVisit = await testHelper
        .getPrisma()
        .placeVisit.findUniqueOrThrow({
          where: { id: response.body.id },
        });

      expect(placeVisit.userIdx).toBe(loginUser.idx);
      expect(placeVisit.nfcIdx).toBe(nfc.idx);
      expect(placeVisit.score).toBe(nfc.score);
      expect(placeVisit.latitude.toNumber()).toBe(latitude);
      expect(placeVisit.longitude.toNumber()).toBe(longitude);
      expect(placeVisit.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime(),
      );
    });

    it('201 - create place visit when encrypted data is included', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: uid.toString('hex').toUpperCase(),
        activatedAt: new Date(),
      });
      const enc = 'A1B2C3D4E5F60708';
      const encryptedCmac = calculateNfcMac(
        deriveNfcSessionMacKey(
          deriveNfcFileReadKey(masterKey, uid),
          uid,
          readCounter,
        ),
        Buffer.from(`${enc}&cmac=`, 'ascii'),
      )
        .toString('hex')
        .toUpperCase();

      const response = await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({
          picc_data: piccData,
          enc,
          cmac: encryptedCmac,
          latitude,
          longitude,
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          userIdx: loginUser.idx,
          nfcIdx: nfc.idx,
          score: nfc.score,
          latitude,
          longitude,
        }),
      );
    });

    it('201 - create place visit at coordinate boundaries', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      const nfc = await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: uid.toString('hex').toUpperCase(),
        activatedAt: new Date(),
      });

      const response = await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({
          picc_data: piccData,
          cmac,
          latitude: -90,
          longitude: 180,
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          nfcIdx: nfc.idx,
          latitude: -90,
          longitude: 180,
        }),
      );
    });

    it('400 - picc data is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ cmac, latitude, longitude })
        .expect(400);
    });

    it('400 - cmac is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, latitude, longitude })
        .expect(400);
    });

    it('400 - picc data is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: 'INVALID', cmac, latitude, longitude })
        .expect(400);
    });

    it('400 - latitude is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, longitude })
        .expect(400);
    });

    it('400 - longitude is missing', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude })
        .expect(400);
    });

    it('400 - latitude is out of range', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude: 90.0000001, longitude })
        .expect(400);
    });

    it('400 - longitude is out of range', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude, longitude: -180.0000001 })
        .expect(400);
    });

    it('401 - access token is missing', async () => {
      await testHelper
        .test()
        .post('/place-visit/nfc')
        .send({ picc_data: piccData, cmac, latitude, longitude })
        .expect(401);
    });

    it('403 - nfc is inactive', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: uid.toString('hex').toUpperCase(),
        activatedAt: null,
      });

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude, longitude })
        .expect(403);
    });

    it('403 - cmac is invalid', async () => {
      const loginUser = testHelper.loginUsers.user1;
      const place = await placeSeedHelper.seed({ activatedAt: new Date() });
      await nfcSeedHelper.seed({
        placeIdx: place.idx,
        uid: uid.toString('hex').toUpperCase(),
        activatedAt: new Date(),
      });

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({
          picc_data: piccData,
          cmac: '0000000000000000',
          latitude,
          longitude,
        })
        .expect(403);
    });

    it('404 - nfc does not exist', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude, longitude })
        .expect(404);
    });
  });
});
