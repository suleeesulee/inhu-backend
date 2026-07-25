import { TestHelper } from '../../setup/test.helper';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { AdminServerModule } from '@admin/admin-server.module';
import { GetManagedUserAllDto } from '@admin/api/user/dto/request/get-managed-user-all.dto';
import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { AdminAccountSeedHelper } from '@libs/testing/seed/admin-account/admin-account.seed';
import { GetManagedUserAllResponseDto } from '@admin/api/user/dto/response/get-managed-user-response.dto';
import { ManagedUserSeedHelper } from '@libs/testing/seed/user/managed-user.seed';

describe('Managed User E2E test', () => {
  let testHelper = TestHelper.create(AdminServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const managedUserSeedHelper = testHelper.seedHelper(ManagedUserSeedHelper);
  const adminSeedHelper = testHelper.seedHelper(AdminAccountSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('Get /managed-user', () => {
    it('200 - should return a list of managed user, not admin/standard user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto: GetManagedUserAllDto = { page: 1 };

      const [standardUser, adminUser] = await userSeedHelper.seedAll([
        {
          nickname: 'standardUser',
          profileImagePath: null,
          social: {
            provider: AuthProvider.APPLE,
          },
        },
        {
          nickname: 'adminUser',
          profileImagePath: null,
        },
      ]);

      const [user1, user2] = await managedUserSeedHelper.seedAll([
        {
          nickname: 'user1',
          profileImagePath: '/profile-image/sample-image.png',
        },
        {
          nickname: 'user2',
          profileImagePath: null,
        },
      ]);

      await adminSeedHelper.seedAll([
        {
          userIdx: adminUser.idx,
        },
      ]);

      const response = await testHelper
        .test()
        .get('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const { count, userList } = response.body as GetManagedUserAllResponseDto;

      expect(count).toBe(2);
      expect(userList.length).toBe(2);

      expect(userList[1].idx).toBe(user1.idx);
      expect(userList[1].nickname).toBe(user1.nickname);
      expect(userList[1].profileImagePath).toBe(user1.profileImagePath);

      expect(userList[0].idx).toBe(user2.idx);
      expect(userList[0].nickname).toBe(user2.nickname);
      expect(userList[0].profileImagePath).toBe(user2.profileImagePath);
    });

    it('403 - Request with just admin permission', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetManagedUserAllDto = { page: 1 };

      await testHelper
        .test()
        .get('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(403);
    });
  });
});
