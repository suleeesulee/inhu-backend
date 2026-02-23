import { AdminRole } from '@admin/api/auth/admin-role.enum';
import { AdminAccountModel } from '@libs/core/admin-account/model/admin-account.model';

export class CreateAdminAccountEntity {
  /**
   * 관리자 계정 고유 번호
   *
   * @example 1
   */
  idx: number;

  /**
   * 관리자 아이디
   *
   * @example "admin_1"
   */
  id: string;

  /**
   * 관리자 비밀번호 (임시 비밀번호)
   *
   * @example "uV8q3N9pLx2A"
   */
  pw: string;

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

  constructor(data: CreateAdminAccountEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: AdminAccountModel,
    pw: string,
  ): CreateAdminAccountEntity {
    return new CreateAdminAccountEntity({
      idx: model.idx,
      id: model.id,
      pw,
      role: model.role,
      nickname: model.user.nickname,
    });
  }
}
