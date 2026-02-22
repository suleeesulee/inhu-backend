import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { AdminAccountModel } from '@libs/core/admin-account/model/admin-account.model';

export class AdminAccountEntity {
  idx: number;
  role: AdminRole;
  nickname: string;

  constructor(data: AdminAccountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: AdminAccountModel): AdminAccountEntity {
    return new AdminAccountEntity({
      idx: model.idx,
      role: model.role,
      nickname: model.user.nickname,
    });
  }
}
