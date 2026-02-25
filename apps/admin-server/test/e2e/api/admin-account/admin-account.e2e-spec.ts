import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { GetAdminAccountAllDto } from '@admin/api/admin/dto/request/get-admin-account-all.dto';
import { AdminAccountEntity } from '@admin/api/admin/entity/admin-account.entity';
import { AdminAccountSeedHelper } from '@libs/testing/seed/admin-account/admin-account.seed';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';
import { CreateAdminAccountDto } from '@admin/api/admin/dto/request/create-admin-account.dto';
import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { CreateAdminAccountEntity } from '@admin/api/admin/entity/create-admin-account.entity';
import { UpdateAdminAccountDto } from '@admin/api/admin/dto/request/update-admin-account.dto';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { HashService } from '@libs/common/modules/hash/hash.service';

describe('Admin Account E2E Tests', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const userSeedHelper = testHelper.seedHelper(UserSeedHelper);
  const adminAccountSeedHelper = testHelper.seedHelper(AdminAccountSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /admin-account', () => {
    it('200 - field check', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;
      const admin2 = await testHelper.loginAdmin.admin2;
      const superAdmin = await testHelper.loginAdmin.superAdmin;
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;

      const dto: GetAdminAccountAllDto = {
        page: 1,
      };

      const response = await testHelper
        .test()
        .get('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .query(dto)
        .expect(200);

      const accountList: AdminAccountEntity[] = response.body.accountList;
      const count: number = response.body.count;

      expect(Array.isArray(accountList)).toBe(true);
      expect(count).toBe(4);
      expect(accountList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            idx: admin1.idx,
            nickname: admin1.nickname,
            role: admin1.role,
          }),
          expect.objectContaining({
            idx: admin2.idx,
            nickname: admin2.nickname,
            role: admin2.role,
          }),
          expect.objectContaining({
            idx: superAdmin.idx,
            nickname: superAdmin.nickname,
            role: superAdmin.role,
          }),
          expect.objectContaining({
            idx: magazineAdmin1.idx,
            nickname: magazineAdmin1.nickname,
            role: magazineAdmin1.role,
          }),
        ]),
      );
    });

    it('200 - pagination check', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const [user1, user2, user3, user4, user5, user6, user7] =
        await userSeedHelper.seedAll([
          {
            nickname: 'testUser1',
          },
          {
            nickname: 'testUser2',
          },
          {
            nickname: 'testUser3',
          },
          {
            nickname: 'testUser4',
          },
          {
            nickname: 'testUser5',
          },
          {
            nickname: 'testUser6',
          },
          {
            nickname: 'testUser7',
          },
        ]);
      await adminAccountSeedHelper.seedAll([
        {
          userIdx: user1.idx,
        },
        {
          userIdx: user2.idx,
        },
        {
          userIdx: user3.idx,
        },
        {
          userIdx: user4.idx,
        },
        {
          userIdx: user5.idx,
        },
        {
          userIdx: user6.idx,
        },
        {
          userIdx: user7.idx,
        },
      ]);

      const dto: GetAdminAccountAllDto = {
        page: 1,
      };

      const response = await testHelper
        .test()
        .get('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .query(dto)
        .expect(200);

      const accountList: AdminAccountEntity[] = response.body.accountList;
      const count: number = response.body.count;

      expect(accountList.length).toBe(10);
      expect(count).toBe(11);

      const response2 = await testHelper
        .test()
        .get('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .query({ page: 2 })
        .expect(200);

      const accountList2: AdminAccountEntity[] = response2.body.accountList;
      const count2: number = response2.body.count;

      expect(accountList2.length).toBe(1);
      expect(count2).toBe(11);
    });

    it('401 - no access token', async () => {
      const dto: GetAdminAccountAllDto = {
        page: 1,
      };

      await testHelper.test().get('/admin-account').query(dto).expect(401);
    });

    it('403 - access token with insufficient role (role is admin)', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: GetAdminAccountAllDto = {
        page: 1,
      };

      await testHelper
        .test()
        .get('/admin-account')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .query(dto)
        .expect(403);
    });

    it('403 - access token with insufficient role (role is magazine admin)', async () => {
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;

      const dto: GetAdminAccountAllDto = {
        page: 1,
      };

      await testHelper
        .test()
        .get('/admin-account')
        .set('Cookie', `token=Bearer ${magazineAdmin1.token}`)
        .query(dto)
        .expect(403);
    });
  });

  describe('GET /admin-account/my', () => {
    it('200 - field check', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const response = await testHelper
        .test()
        .get('/admin-account/my')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const adminAccount: AdminAccountEntity = response.body;

      expect(adminAccount).toEqual(
        expect.objectContaining({
          idx: superAdmin.idx,
          nickname: superAdmin.nickname,
          role: superAdmin.role,
        }),
      );
    });

    it('401 - no access token', async () => {
      await testHelper.test().get('/admin-account/my').expect(401);
    });
  });

  describe('POST /admin-account', () => {
    it('201 - field check', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin',
        id: 'newAdmin1234',
        pw: 'newAdmin1234',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: dto.nickname,
          id: dto.id,
          pw: dto.pw,
          role: dto.role,
        }),
      );
    });

    it('201 - field check (without pw)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin2',
        id: 'newAdmin12345',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: dto.nickname,
          id: dto.id,
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.pw).toBeDefined();
    });

    it('201 - field check (without id)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin2',
        pw: 'newAdmin12345',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: dto.nickname,
          pw: dto.pw,
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.id).toBeDefined();
    });

    it('201 - field check (without nickname)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        id: 'newAdmin12345',
        pw: 'newAdmin12345',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: 'admin',
          id: dto.id,
          pw: dto.pw,
          role: dto.role,
        }),
      );
    });

    it('201 - field check (without nickname and id)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        pw: 'newAdmin12345',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: 'admin',
          pw: dto.pw,
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.id).toBeDefined();
    });

    it('201 - field check (without nickname and pw)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        id: 'newAdmin12345',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: 'admin',
          id: dto.id,
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.pw).toBeDefined();
    });

    it('201 - field check (without id and pw)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin2',
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          nickname: dto.nickname,
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.id).toBeDefined();
      expect(createdAdminAccount.pw).toBeDefined();
    });

    it('201 - field check (only role)', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        role: AdminRole.Admin,
      };

      const response = await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(201);

      const createdAdminAccount: CreateAdminAccountEntity = response.body;
      expect(createdAdminAccount).toEqual(
        expect.objectContaining({
          role: dto.role,
        }),
      );
      expect(createdAdminAccount.nickname).toBe('admin');
      expect(createdAdminAccount.id).toBeDefined();
      expect(createdAdminAccount.pw).toBeDefined();
    });

    it('401 - no access token', async () => {
      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin',
        id: 'newAdmin1234',
        pw: 'newAdmin1234',
        role: AdminRole.Admin,
      };

      await testHelper.test().post('/admin-account').send(dto).expect(401);
    });

    it('403 - access token with insufficient role (role is admin)', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin',
        id: 'newAdmin1234',
        pw: 'newAdmin1234',
        role: AdminRole.Admin,
      };

      await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(403);
    });

    it('403 - access token with insufficient role (role is magazine admin)', async () => {
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;

      const dto: CreateAdminAccountDto = {
        nickname: 'newAdmin',
        id: 'newAdmin1234',
        pw: 'newAdmin1234',
        role: AdminRole.Admin,
      };

      await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${magazineAdmin1.token}`)
        .send(dto)
        .expect(403);
    });

    it('403 - cannot create super admin account', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const dto: CreateAdminAccountDto = {
        nickname: 'SuperAdmin',
        id: 'newSuperAdmin',
        pw: 'newSuperAdmin',
        role: AdminRole.SuperAdmin,
      };

      await testHelper
        .test()
        .post('/admin-account')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(dto)
        .expect(403);
    });
  });

  describe('PUT /admin-account/my', () => {
    it('200 - successfully update my info', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        nickname: 'updatedAdmin1',
        id: 'updatedAdmin1234',
        pw: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: dto.nickname,
          }),
          id: dto.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(dto.pw ?? '', adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without pw', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        nickname: 'updatedAdmin1',
        id: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: dto.nickname,
          }),
          id: dto.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(admin1.pw, adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without id', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        nickname: 'updatedAdmin1',
        pw: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: dto.nickname,
          }),
          id: admin1.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(dto.pw ?? '', adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without nickname', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        id: 'updatedAdmin1234',
        pw: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: admin1.nickname,
          }),
          id: dto.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(dto.pw ?? '', adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without nickname and id', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        pw: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: admin1.nickname,
          }),
          id: admin1.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(dto.pw ?? '', adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without nickname and pw', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        id: 'updatedAdmin1234',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: admin1.nickname,
          }),
          id: dto.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(admin1.pw, adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('200 - update my info without id and pw', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      const dto: UpdateAdminAccountDto = {
        nickname: 'updatedAdmin1',
      };

      await testHelper
        .test()
        .put('/admin-account/my')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .send(dto)
        .expect(200);

      const adminAccountModel = await testHelper
        .get(AdminAccountCoreService)
        .getAdminAccountByIdx(admin1.idx);
      if (!adminAccountModel) {
        throw new Error('Admin account not found');
      }

      expect(adminAccountModel).toEqual(
        expect.objectContaining({
          idx: admin1.idx,
          user: expect.objectContaining({
            nickname: dto.nickname,
          }),
          id: admin1.id,
          role: admin1.role,
        }),
      );

      const isPasswordValid = await testHelper
        .get(HashService)
        .compare(admin1.pw, adminAccountModel.pw);
      expect(isPasswordValid).toBe(true);
    });

    it('401 - no access token', async () => {
      const dto: UpdateAdminAccountDto = {
        nickname: 'updatedAdmin1',
        id: 'updatedAdmin1234',
        pw: 'updatedAdmin1234',
      };

      await testHelper.test().put('/admin-account/my').send(dto).expect(401);
    });
  });

  describe('DELETE /admin-account/:idx', () => {
    it('200 - successfully delete admin account', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      const admin1 = await userSeedHelper.seed({
        nickname: 'admin1',
      });
      const adminAccount1 = await adminAccountSeedHelper.seed({
        userIdx: admin1.idx,
      });

      const adminAccountCoreService = testHelper.get(AdminAccountCoreService);
      const adminAccountModelBeforeDelete =
        await adminAccountCoreService.getAdminAccountByIdx(
          adminAccount1.userIdx,
        );
      expect(adminAccountModelBeforeDelete).not.toBeNull();

      await testHelper
        .test()
        .delete(`/admin-account/${adminAccount1.userIdx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const adminAccountModelAfterDelete =
        await adminAccountCoreService.getAdminAccountByIdx(
          adminAccount1.userIdx,
        );
      expect(adminAccountModelAfterDelete).toBeNull();
    });

    it('401 - no access token', async () => {
      await testHelper.test().delete('/admin-account/1').expect(401);
    });

    it('403 - access token with insufficient role (role is admin)', async () => {
      const admin1 = await testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/admin-account/1')
        .set('Cookie', `token=Bearer ${admin1.token}`)
        .expect(403);
    });

    it('403 - access token with insufficient role (role is magazine admin)', async () => {
      const magazineAdmin1 = await testHelper.loginAdmin.magazineAdmin1;

      await testHelper
        .test()
        .delete('/admin-account/1')
        .set('Cookie', `token=Bearer ${magazineAdmin1.token}`)
        .expect(403);
    });

    it('403 - cannot delete super admin account', async () => {
      const superAdmin = await testHelper.loginAdmin.superAdmin;

      await testHelper
        .test()
        .delete(`/admin-account/${superAdmin.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(403);
    });
  });
});
