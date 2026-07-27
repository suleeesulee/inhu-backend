import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { AdminAccountModel } from '@libs/core/admin-account/model/admin-account.model';

export class AdminAccountEntity {
  /**
   * 관리자 계정 고유 번호
   *
   * @example 1
   */
  idx: number;

  /**
   * 관리자 권한
   */
  role: AdminRole;

  /**
   * 관리자 닉네임
   *
   * @example "홍길동"
   */
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
