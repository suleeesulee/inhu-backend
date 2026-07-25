import { TestHelper } from '../../setup/test.helper';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { AdminServerModule } from '@admin/admin-server.module';
import { GetManagedUserAllDto } from '@admin/api/user/dto/request/get-managed-user-all.dto';
import { AuthProvider } from '@libs/core/user/constants/auth-provider.constant';
import { AdminAccountSeedHelper } from '@libs/testing/seed/admin-account/admin-account.seed';
import { GetManagedUserAllResponseDto } from '@admin/api/user/dto/response/get-managed-user-response.dto';
import { ManagedUserSeedHelper } from '@libs/testing/seed/user/managed-user.seed';
import { ManagedUserEntity } from '@admin/api/user/entity/managed-user.entity';
import { CreateManagedUserDto } from '@admin/api/user/dto/request/create-managed-user.dto';
import { UpdateManagedUserDto } from '@admin/api/user/dto/request/update-managed-user.dto';

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

    it('200 - should return the second page of managed users', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto: GetManagedUserAllDto = { page: 2 };

      await managedUserSeedHelper.seedAll(new Array(12).fill({}));

      const response = await testHelper
        .test()
        .get('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const { count, userList } = response.body as GetManagedUserAllResponseDto;

      expect(count).toBe(12);
      expect(userList).toHaveLength(2);
    });

    it('200 - should not include soft-deleted managed users', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto: GetManagedUserAllDto = { page: 1 };

      await managedUserSeedHelper.seedAll([{}, {}, { deletedAt: new Date() }]);

      const response = await testHelper
        .test()
        .get('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const { count, userList } = response.body as GetManagedUserAllResponseDto;

      expect(count).toBe(2);
      expect(userList).toHaveLength(2);
    });

    it('401 - no access token provided', async () => {
      const dto: GetManagedUserAllDto = { page: 1 };

      await testHelper.test().get('/managed-user').query(dto).expect(401);
    });

    it('400 - invalid page type', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto = { page: 'abc' };

      await testHelper
        .test()
        .get('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .query(dto)
        .expect(400);
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

  describe('Get /managed-user/:idx', () => {
    it('200 - should return a managed user by idx', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const user = await managedUserSeedHelper.seed({
        nickname: 'targetUser',
        profileImagePath: '/profile-image/target.png',
      });

      const response = await testHelper
        .test()
        .get(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const body = response.body as ManagedUserEntity;

      expect(body.idx).toBe(user.idx);
      expect(body.nickname).toBe(user.nickname);
      expect(body.profileImagePath).toBe(user.profileImagePath);
      expect(body.createdAt).toBeDefined();
    });

    it('401 - no access token provided', async () => {
      const user = await managedUserSeedHelper.seed({});

      await testHelper.test().get(`/managed-user/${user.idx}`).expect(401);
    });

    it('403 - Request with just admin permission', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await managedUserSeedHelper.seed({});

      await testHelper
        .test()
        .get(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });

    it('404 - managed user not found', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const nonExistentIdx = 99999;

      await testHelper
        .test()
        .get(`/managed-user/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });

  describe('Post /managed-user', () => {
    it('201 - should create a managed user with profileImagePath', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto: CreateManagedUserDto = {
        nickname: 'newUser',
        profileImagePath: '/profile-image/new.png',
      };

      const response = await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const body = response.body as ManagedUserEntity;

      expect(body.idx).toBeDefined();
      expect(body.nickname).toBe(dto.nickname);
      expect(body.profileImagePath).toBe(dto.profileImagePath);
      expect(body.createdAt).toBeDefined();
    });

    it('201 - should create a managed user without profileImagePath (null)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto: CreateManagedUserDto = {
        nickname: 'noimguser',
        profileImagePath: null,
      };

      const response = await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(201);

      const body = response.body as ManagedUserEntity;

      expect(body.idx).toBeDefined();
      expect(body.nickname).toBe(dto.nickname);
      expect(body.profileImagePath).toBeNull();
    });

    it('401 - no access token provided', async () => {
      const dto: CreateManagedUserDto = {
        nickname: 'newUser',
        profileImagePath: null,
      };

      await testHelper.test().post('/managed-user').send(dto).expect(401);
    });

    it('403 - Request with just admin permission', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: CreateManagedUserDto = {
        nickname: 'newUser',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('400 - nickname exceeds max length (10)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto = {
        nickname: 'thisIsWayTooLongNickname',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });

    it('400 - nickname is empty string', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto = {
        nickname: '',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });

    it('400 - nickname is missing', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const dto = {
        profileImagePath: null,
      };

      await testHelper
        .test()
        .post('/managed-user')
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });
  });

  describe('Put /managed-user/:idx', () => {
    it('200 - should update a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const user = await managedUserSeedHelper.seed({
        nickname: 'origin',
        profileImagePath: '/profile-image/original.png',
      });

      const dto: UpdateManagedUserDto = {
        nickname: 'update',
        profileImagePath: '/profile-image/updated.png',
      };

      await testHelper
        .test()
        .put(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(200);

      const response = await testHelper
        .test()
        .get(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      const body = response.body as ManagedUserEntity;

      expect(body.nickname).toBe(dto.nickname);
      expect(body.profileImagePath).toBe(dto.profileImagePath);
    });

    it('401 - no access token provided', async () => {
      const user = await managedUserSeedHelper.seed({});
      const dto: UpdateManagedUserDto = {
        nickname: 'updatedNick',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .put(`/managed-user/${user.idx}`)
        .send(dto)
        .expect(401);
    });

    it('403 - Request with just admin permission', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await managedUserSeedHelper.seed({});
      const dto: UpdateManagedUserDto = {
        nickname: 'updatedNick',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .put(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(403);
    });

    it('404 - managed user not found', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const nonExistentIdx = 99999;
      const dto: UpdateManagedUserDto = {
        nickname: 'update',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .put(`/managed-user/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(404);
    });

    it('400 - nickname exceeds max length (10)', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const user = await managedUserSeedHelper.seed({});
      const dto = {
        nickname: 'thisIsWayTooLongNickname',
        profileImagePath: null,
      };

      await testHelper
        .test()
        .put(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .send(dto)
        .expect(400);
    });
  });

  describe('Delete /managed-user/:idx', () => {
    it('200 - should soft-delete a managed user', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;

      const user = await managedUserSeedHelper.seed({});

      await testHelper
        .test()
        .delete(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(200);

      // 삭제 후 조회 시 404 응답 확인
      await testHelper
        .test()
        .get(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });

    it('401 - no access token provided', async () => {
      const user = await managedUserSeedHelper.seed({});

      await testHelper.test().delete(`/managed-user/${user.idx}`).expect(401);
    });

    it('403 - Request with just admin permission', async () => {
      const loginUser = testHelper.loginAdmin.admin1;

      const user = await managedUserSeedHelper.seed({});

      await testHelper
        .test()
        .delete(`/managed-user/${user.idx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(403);
    });

    it('404 - managed user not found', async () => {
      const loginUser = testHelper.loginAdmin.superAdmin;
      const nonExistentIdx = 99999;

      await testHelper
        .test()
        .delete(`/managed-user/${nonExistentIdx}`)
        .set('Cookie', `token=Bearer ${loginUser.token}`)
        .expect(404);
    });
  });
});
