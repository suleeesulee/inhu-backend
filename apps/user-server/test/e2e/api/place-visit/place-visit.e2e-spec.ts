import {
  calculateNfcMac,
  deriveNfcFileReadKey,
  deriveNfcMetaReadKey,
  deriveNfcSessionMacKey,
} from '@libs/core/nfc/nfc-crypto';
import { NfcSeedHelper } from '@libs/testing/seed/nfc/nfc.seed';
import { PlaceSeedHelper } from '@libs/testing/seed/place/place.seed';
import { AppModule } from '@user/app.module';
import { createCipheriv } from 'crypto';
import { TestHelper } from '../../setup/test.helper';

describe('Place Visit E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const nfcSeedHelper = testHelper.seedHelper(NfcSeedHelper);
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

    it('400 - latitude has more than seven decimal places', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude: 37.45083712, longitude })
        .expect(400);
    });

    it('400 - longitude has more than seven decimal places', async () => {
      const loginUser = testHelper.loginUsers.user1;

      await testHelper
        .test()
        .post('/place-visit/nfc')
        .set('Authorization', `Bearer ${loginUser.web.accessToken}`)
        .send({ picc_data: piccData, cmac, latitude, longitude: 126.65313241 })
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
