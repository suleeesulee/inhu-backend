import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { LoginTokenService } from '@admin/common/modules/login-token/login-token.service';
import { HashService } from '@libs/common/modules/hash/hash.service';
import { ITestHelper } from '@libs/testing/interface/test-helper.interface';

export type LoginAdminForTest = {
  idx: number;
  id: string;
  pw: string;
  nickname: string;
  role: AdminRole;
  token: string;
};

export class LoginAdminHelper {
  public static async create(testHelper: ITestHelper): Promise<{
    admin1: LoginAdminForTest;
    admin2: LoginAdminForTest;
    superAdmin: LoginAdminForTest;
    magazineAdmin: LoginAdminForTest;
  }> {
    const [admin1Form, admin2Form, superAdminForm, magazineAdminForm] = [
      {
        nickname: 'admin-1-nick',
        id: 'admin-1-id',
        pw: 'admin-1-pw',
        role: AdminRole.Admin,
      },
      {
        nickname: 'admin-2-nick',
        id: 'admin-2-id',
        pw: 'admin-2-pw',
        role: AdminRole.Admin,
      },
      {
        nickname: 'super-admin-nick',
        id: 'super-admin-id',
        pw: 'super-admin-pw',
        role: AdminRole.SuperAdmin,
      },
      {
        nickname: 'magazine-admin-nick',
        id: 'magazine-admin-id',
        pw: 'magazine-admin-pw',
        role: AdminRole.MagazineAdmin,
      },
    ];

    const [user1, user2, user3, user4] = await Promise.all([
      testHelper.getPrisma().user.create({
        data: {
          nickname: admin1Form.nickname,
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: admin2Form.nickname,
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: superAdminForm.nickname,
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: magazineAdminForm.nickname,
          profileImagePath: null,
        },
      }),
    ]);

    const [admin1, admin2, admin3, admin4] = await Promise.all([
      testHelper.getPrisma().adminAccount.create({
        select: {
          idx: true,
          id: true,
          role: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
        data: {
          idx: user1.idx,
          id: admin1Form.id,
          pw: await testHelper.get(HashService).hash(admin1Form.pw),
          role: admin1Form.role,
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        select: {
          idx: true,
          id: true,
          role: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
        data: {
          idx: user2.idx,
          id: admin2Form.id,
          pw: await testHelper.get(HashService).hash(admin2Form.pw),
          role: admin2Form.role,
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        select: {
          idx: true,
          id: true,
          role: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
        data: {
          idx: user3.idx,
          id: superAdminForm.id,
          pw: await testHelper.get(HashService).hash(superAdminForm.pw),
          role: superAdminForm.role,
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        select: {
          idx: true,
          id: true,
          role: true,
          user: {
            select: {
              nickname: true,
            },
          },
        },
        data: {
          idx: user4.idx,
          id: magazineAdminForm.id,
          pw: await testHelper.get(HashService).hash(magazineAdminForm.pw),
          role: magazineAdminForm.role,
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
        id: admin1Form.id,
        pw: admin1Form.pw,
        nickname: admin1Form.nickname,
        role: admin1Form.role as AdminRole,
        token: admin1Token,
      },
      admin2: {
        idx: admin2.idx,
        id: admin2Form.id,
        pw: admin2Form.pw,
        nickname: admin2Form.nickname,
        role: admin2Form.role as AdminRole,
        token: admin2Token,
      },
      superAdmin: {
        idx: admin3.idx,
        id: superAdminForm.id,
        pw: superAdminForm.pw,
        nickname: superAdminForm.nickname,
        role: superAdminForm.role as AdminRole,
        token: superAdminToken,
      },
      magazineAdmin: {
        idx: admin4.idx,
        id: magazineAdminForm.id,
        pw: magazineAdminForm.pw,
        nickname: magazineAdminForm.nickname,
        role: magazineAdminForm.role as AdminRole,
        token: magazineAdminToken,
      },
    };
  }
}
