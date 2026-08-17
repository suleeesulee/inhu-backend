import { faker } from '@faker-js/faker';
import { InstallationSeedHelper } from '@libs/testing/seed/installation/installation.seed';
import { PushTokenSeedHelper } from '@libs/testing/seed/push-token/push-token.seed';
import { AppModule } from '@user/app.module';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('InstallationLifecycle E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const installationSeedHelper = testHelper.seedHelper(InstallationSeedHelper);
  const pushTokenSeedHelper = testHelper.seedHelper(PushTokenSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /installation-lifecycle', () => {
    describe('비로그인 유저 (refreshToken 없음)', () => {
      it('201 - pushToken 없이 installation 생성', async () => {
        const installationId = faker.string.uuid();

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId,
            appVersion: '1.0.0',
            platform: 'ios',
          })
          .expect(201);

        const prisma = testHelper.getPrisma();

        const installation = await prisma.installation.findUnique({
          where: { id: installationId },
        });
        expect(installation).not.toBeNull();
        expect(installation!.userIdx).toBeNull();
        expect(installation!.refreshTokenExpiresAt).toBeNull();
        expect(installation!.appVersion).toBe('1.0.0');
        expect(installation!.platform).toBe('ios');

        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationId },
        });
        expect(pushToken).toBeNull();
      });

      it('201 - pushToken과 함께 installation 생성', async () => {
        const installationId = faker.string.uuid();
        const expoPushToken = `ExponentPushToken[${faker.string.alphanumeric(22)}]`;

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId,
            appVersion: '2.1.0',
            platform: 'android',
            pushNotificationToken: expoPushToken,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();

        const installation = await prisma.installation.findUnique({
          where: { id: installationId },
        });
        expect(installation).not.toBeNull();
        expect(installation!.userIdx).toBeNull();
        expect(installation!.platform).toBe('android');

        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationId },
        });
        expect(pushToken).not.toBeNull();
        expect(pushToken!.expoPushToken).toBe(expoPushToken);
      });
    });

    describe('로그인 유저 (refreshToken 있음)', () => {
      it('201 - pushToken 없이 installation 생성 (userIdx 연결됨)', async () => {
        const loginUser = testHelper.loginUsers.user1;
        const installationId = faker.string.uuid();

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId,
            appVersion: '1.0.0',
            platform: 'ios',
            refreshToken: loginUser.app.refreshToken,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();

        const installation = await prisma.installation.findUnique({
          where: { id: installationId },
        });
        expect(installation).not.toBeNull();
        expect(installation!.userIdx).toBe(loginUser.idx);
        expect(installation!.refreshTokenExpiresAt).not.toBeNull();

        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationId },
        });
        expect(pushToken).toBeNull();
      });

      it('201 - pushToken과 함께 installation 생성 (userIdx 연결됨)', async () => {
        const loginUser = testHelper.loginUsers.user1;
        const installationId = faker.string.uuid();
        const expoPushToken = `ExponentPushToken[${faker.string.alphanumeric(22)}]`;

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId,
            appVersion: '3.0.0',
            platform: 'ios',
            refreshToken: loginUser.app.refreshToken,
            pushNotificationToken: expoPushToken,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();

        const installation = await prisma.installation.findUnique({
          where: { id: installationId },
        });
        expect(installation).not.toBeNull();
        expect(installation!.userIdx).toBe(loginUser.idx);

        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationId },
        });
        expect(pushToken).not.toBeNull();
        expect(pushToken!.expoPushToken).toBe(expoPushToken);
      });
    });

    describe('Upsert - 기존 installation 업데이트', () => {
      it('201 - 기존 installation이 있을 때 appVersion, platform 업데이트', async () => {
        const installationSeed = await installationSeedHelper.seed({
          platform: 'ios',
          appVersion: '1.0.0',
        });

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: '2.0.0',
            platform: 'android',
          })
          .expect(201);

        const prisma = testHelper.getPrisma();

        const installation = await prisma.installation.findUnique({
          where: { id: installationSeed.id },
        });
        expect(installation!.appVersion).toBe('2.0.0');
        expect(installation!.platform).toBe('android');
      });

      it('201 - pushToken 없던 installation에 pushToken 추가', async () => {
        const installationSeed = await installationSeedHelper.seed({});
        const expoPushToken = `ExponentPushToken[${faker.string.alphanumeric(22)}]`;

        // pushToken이 없는 상태 확인
        const prisma = testHelper.getPrisma();
        const beforePushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(beforePushToken).toBeNull();

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: installationSeed.appVersion,
            platform: installationSeed.platform,
            pushNotificationToken: expoPushToken,
          })
          .expect(201);

        const afterPushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(afterPushToken).not.toBeNull();
        expect(afterPushToken!.expoPushToken).toBe(expoPushToken);
      });

      it('201 - 기존 pushToken이 있을 때 새 pushToken으로 업데이트', async () => {
        const installationSeed = await installationSeedHelper.seed({});
        const oldExpoPushToken = `ExponentPushToken[${faker.string.alphanumeric(22)}]`;
        const newExpoPushToken = `ExponentPushToken[${faker.string.alphanumeric(22)}]`;

        await pushTokenSeedHelper.seed({
          id: installationSeed.id,
          expoPushToken: oldExpoPushToken,
        });

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: installationSeed.appVersion,
            platform: installationSeed.platform,
            pushNotificationToken: newExpoPushToken,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();
        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(pushToken!.expoPushToken).toBe(newExpoPushToken);
      });

      it('201 - pushToken이 있던 installation에서 pushToken 삭제 (pushNotificationToken=null)', async () => {
        const installationSeed = await installationSeedHelper.seed({});

        await pushTokenSeedHelper.seed({ id: installationSeed.id });

        // pushToken이 있는 상태 확인
        const prisma = testHelper.getPrisma();
        const beforePushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(beforePushToken).not.toBeNull();

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: installationSeed.appVersion,
            platform: installationSeed.platform,
            pushNotificationToken: null,
          })
          .expect(201);

        const afterPushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(afterPushToken).toBeNull();
      });

      it('201 - pushToken 없는 installation에 pushToken=null 전달 시 아무것도 하지 않음', async () => {
        const installationSeed = await installationSeedHelper.seed({});

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: installationSeed.appVersion,
            platform: installationSeed.platform,
            pushNotificationToken: null,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();
        const pushToken = await prisma.pushToken.findUnique({
          where: { id: installationSeed.id },
        });
        expect(pushToken).toBeNull();
      });

      it('201 - 로그인 유저가 기존 installation의 userIdx를 업데이트', async () => {
        const loginUser = testHelper.loginUsers.user1;
        const installationSeed = await installationSeedHelper.seed({
          userIdx: null,
        });

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: installationSeed.id,
            appVersion: installationSeed.appVersion,
            platform: installationSeed.platform,
            refreshToken: loginUser.app.refreshToken,
          })
          .expect(201);

        const prisma = testHelper.getPrisma();
        const installation = await prisma.installation.findUnique({
          where: { id: installationSeed.id },
        });
        expect(installation!.userIdx).toBe(loginUser.idx);
        expect(installation!.refreshTokenExpiresAt).not.toBeNull();
      });
    });

    describe('400 - 유효성 검사 실패', () => {
      it('400 - installationId 누락', async () => {
        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            appVersion: '1.0.0',
            platform: 'ios',
          })
          .expect(400);
      });

      it('400 - appVersion 누락', async () => {
        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: faker.string.uuid(),
            platform: 'ios',
          })
          .expect(400);
      });

      it('400 - platform 누락', async () => {
        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: faker.string.uuid(),
            appVersion: '1.0.0',
          })
          .expect(400);
      });

      it('400 - platform이 허용되지 않는 값 (ios, android 외)', async () => {
        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: faker.string.uuid(),
            appVersion: '1.0.0',
            platform: 'windows',
          })
          .expect(400);
      });
    });

    describe('401 - 인증 실패', () => {
      it('401 - 유효하지 않은 refreshToken 전달 시 실패', async () => {
        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: faker.string.uuid(),
            appVersion: '1.0.0',
            platform: 'ios',
            refreshToken: 'invalid.refresh.token',
          })
          .expect(401);
      });

      it('401 - Redis에 존재하지 않는 refreshToken (로그아웃된 토큰)', async () => {
        const loginUser = testHelper.loginUsers.user1;

        // 토큰 무효화 (로그아웃)
        const loginTokenService = testHelper.get(LoginTokenService);
        await loginTokenService.invalidateAllRefreshTokens(loginUser.idx);

        await testHelper
          .test()
          .post('/installation-lifecycle')
          .send({
            installationId: faker.string.uuid(),
            appVersion: '1.0.0',
            platform: 'ios',
            refreshToken: loginUser.app.refreshToken, // 유효한 형식이지만 Redis에서 삭제됨
          })
          .expect(401);
      });
    });
  });
});
