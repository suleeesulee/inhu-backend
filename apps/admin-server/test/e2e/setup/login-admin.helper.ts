import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { LoginTokenService } from '@admin/common/modules/login-token/login-token.service';
import { HashService } from '@libs/common/modules/hash/hash.service';
import { ITestHelper } from '@libs/testing/interface/test-helper.interface';

export type LoginAdminForTest = {
  idx: number;
  id: string;
  token: string;
};

export class LoginAdminHelper {
  public static async create(testHelper: ITestHelper): Promise<{
    admin1: LoginAdminForTest;
    admin2: LoginAdminForTest;
    superAdmin: LoginAdminForTest;
    magazineAdmin: LoginAdminForTest;
  }> {
    const [user1, user2, user3, user4] = await Promise.all([
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-1-nick',
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-2-nick',
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-3-nick',
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-4-nick',
          profileImagePath: null,
        },
      }),
    ]);

    const [admin1, admin2, admin3, admin4] = await Promise.all([
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user1.idx,
          id: 'admin-1-id',
          pw: await testHelper.get(HashService).hash('admin-1-pw'),
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user2.idx,
          id: 'admin-2-id',
          pw: await testHelper.get(HashService).hash('admin-2-pw'),
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user3.idx,
          id: 'super-admin-id',
          pw: await testHelper.get(HashService).hash('super-admin-pw'),
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user4.idx,
          id: 'magazine-admin-id',
          pw: await testHelper.get(HashService).hash('magazine-admin-pw'),
        },
      }),
    ]);

    const [admin1Token, admin2Token, superAdminToken, magazineAdminToken] =
      await Promise.all([
        await testHelper
          .get(LoginTokenService)
          .generateAdminToken(admin1.idx, AdminRole.Admin),
        await testHelper
          .get(LoginTokenService)
          .generateAdminToken(admin2.idx, AdminRole.Admin),
        await testHelper
          .get(LoginTokenService)
          .generateAdminToken(admin3.idx, AdminRole.SuperAdmin),
        await testHelper
          .get(LoginTokenService)
          .generateAdminToken(admin4.idx, AdminRole.MagazineAdmin),
      ]);

    return {
      admin1: {
        idx: admin1.idx,
        id: admin1.id,
        token: admin1Token,
      },
      admin2: {
        idx: admin2.idx,
        id: admin2.id,
        token: admin2Token,
      },
      superAdmin: {
        idx: admin3.idx,
        id: admin3.id,
        token: superAdminToken,
      },
      magazineAdmin: {
        idx: admin4.idx,
        id: admin4.id,
        token: magazineAdminToken,
      },
    };
  }
}
