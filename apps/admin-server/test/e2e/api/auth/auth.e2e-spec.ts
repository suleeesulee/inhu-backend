import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { extractCookieValueFromSetCookieHeader } from '@libs/testing/utils/extract-cookie-value.util';
import { ComparePasswordDto } from '@admin/api/auth/dto/request/compare-password.dto';

describe('Auth E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('POST /auth/login', () => {
    it('200 - successfully issue a token', async () => {
      const response = await testHelper
        .test()
        .post('/auth/login')
        .send({ id: 'admin-1-id', pw: 'admin-1-pw' })
        .expect(200);

      // Set-Cookie 헤더에서 토큰이 설정되었는지 확인
      const token = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'token',
      );
      expect(token).not.toBeNull();
    });

    it('400 - id is missing', async () => {
      await testHelper
        .test()
        .post('/auth/login')
        .send({ pw: 'admin-1-pw' })
        .expect(400);
    });

    it('400 - pw is missing', async () => {
      await testHelper
        .test()
        .post('/auth/login')
        .send({ id: 'admin-1-id' })
        .expect(400);
    });

    it('400 - invalid id', async () => {
      await testHelper
        .test()
        .post('/auth/login')
        .send({ id: 'wrong-id', pw: 'wrong-password' })
        .expect(400);
    });

    it('400 - invalid password', async () => {
      await testHelper
        .test()
        .post('/auth/login')
        .send({ id: 'admin-1-id', pw: 'wrong-password' })
        .expect(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('200 - successfully clear a token', async () => {
      const beforeToken = testHelper.loginAdmin.admin1.token;

      const response = await testHelper
        .test()
        .post('/auth/logout')
        .set('Cookie', [`token=${beforeToken}`])
        .expect(200);

      // Set-Cookie 헤더에서 토큰이 삭제되었는지 확인
      const afterToken = extractCookieValueFromSetCookieHeader(
        response.headers['set-cookie'][0],
        'token',
      );
      expect(afterToken).toBeNull();
    });
  });

  describe('POST /auth/compare-password', () => {
    it('201 - successfully compare password (super admin)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const dto: ComparePasswordDto = {
        pw: loginUser.pw,
      };

      await testHelper
        .test()
        .post('/auth/compare-password')
        .set('Cookie', [`token=Bearer ${loginUser.token}`])
        .send(dto)
        .expect(201);
    });

    it('201 - successfully compare password (admin)', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const dto: ComparePasswordDto = {
        pw: loginUser.pw,
      };

      await testHelper
        .test()
        .post('/auth/compare-password')
        .set('Cookie', [`token=Bearer ${loginUser.token}`])
        .send(dto)
        .expect(201);
    });

    it('201 - successfully compare password (magazine admin)', async () => {
      const loginUser = testHelper.loginAdmin.magazineAdmin1;

      const dto: ComparePasswordDto = {
        pw: loginUser.pw,
      };

      await testHelper
        .test()
        .post('/auth/compare-password')
        .set('Cookie', [`token=Bearer ${loginUser.token}`])
        .send(dto)
        .expect(201);
    });

    it('201 - successfully compare password (all)', async () => {
      const loginUser = testHelper.loginAdmin.allAdmin1;

      const dto: ComparePasswordDto = {
        pw: loginUser.pw,
      };

      await testHelper
        .test()
        .post('/auth/compare-password')
        .set('Cookie', [`token=Bearer ${loginUser.token}`])
        .send(dto)
        .expect(201);
    });
  });
});
