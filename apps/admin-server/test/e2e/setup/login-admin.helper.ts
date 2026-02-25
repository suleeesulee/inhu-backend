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
    magazineAdmin1: LoginAdminForTest;
    magazineAdmin2: LoginAdminForTest;
    allAdmin1: LoginAdminForTest;
  }> {
    const [
      admin1Form,
      admin2Form,
      superAdminForm,
      magazineAdmin1Form,
      magazineAdmin2Form,
      allAdminForm1,
    ] = [
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
        nickname: 'magazine-admin-1-nick',
        id: 'magazine-admin-1-id',
        pw: 'magazine-admin-1-pw',
        role: AdminRole.MagazineAdmin,
      },
      {
        nickname: 'magazine-admin-2-nick',
        id: 'magazine-admin-2-id',
        pw: 'magazine-admin-2-pw',
        role: AdminRole.MagazineAdmin,
      },
      {
        nickname: 'all-admin-1-nick',
        id: 'all-admin-1-id',
        pw: 'all-admin-1-pw',
        role: AdminRole.All,
      },
    ];

    const [user1, user2, user3, user4, user5, user6] = await Promise.all([
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
          nickname: magazineAdmin1Form.nickname,
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: magazineAdmin2Form.nickname,
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: allAdminForm1.nickname,
          profileImagePath: null,
        },
      }),
    ]);

    const [admin1, admin2, admin3, admin4, admin5, admin6] = await Promise.all([
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
          id: magazineAdmin1Form.id,
          pw: await testHelper.get(HashService).hash(magazineAdmin1Form.pw),
          role: magazineAdmin1Form.role,
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
          idx: user5.idx,
          id: magazineAdmin2Form.id,
          pw: await testHelper.get(HashService).hash(magazineAdmin2Form.pw),
          role: magazineAdmin2Form.role,
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
          idx: user6.idx,
          id: allAdminForm1.id,
          pw: await testHelper.get(HashService).hash(allAdminForm1.pw),
          role: allAdminForm1.role,
        },
      }),
    ]);

    const [
      admin1Token,
      admin2Token,
      superAdminToken,
      magazineAdmin1Token,
      magazineAdmin2Token,
      allAdminToken,
    ] = await Promise.all([
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
      await testHelper
        .get(LoginTokenService)
        .generateAdminToken(admin5.idx, AdminRole.MagazineAdmin),
      await testHelper
        .get(LoginTokenService)
        .generateAdminToken(admin6.idx, AdminRole.All),
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
      magazineAdmin1: {
        idx: admin4.idx,
        id: magazineAdmin1Form.id,
        pw: magazineAdmin1Form.pw,
        nickname: magazineAdmin1Form.nickname,
        role: magazineAdmin1Form.role as AdminRole,
        token: magazineAdmin1Token,
      },
      magazineAdmin2: {
        idx: admin5.idx,
        id: magazineAdmin2Form.id,
        pw: magazineAdmin2Form.pw,
        nickname: magazineAdmin2Form.nickname,
        role: magazineAdmin2Form.role as AdminRole,
        token: magazineAdmin2Token,
      },
      allAdmin1: {
        idx: admin6.idx,
        id: allAdminForm1.id,
        pw: allAdminForm1.pw,
        nickname: allAdminForm1.nickname,
        role: allAdminForm1.role as AdminRole,
        token: allAdminToken,
      },
    };
  }
}
