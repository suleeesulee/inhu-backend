import { SelectAdminUser } from './prisma-type/select-admin-user';

export class AdminUserModel {
  public nickname: string;

  constructor(data: AdminUserModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(user: SelectAdminUser): AdminUserModel {
    return new AdminUserModel({
      nickname: user.nickname,
    });
  }
}
