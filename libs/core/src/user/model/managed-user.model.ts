import { SelectManagedUser } from './prisma-type/select-managed-user';

export class ManagedUserModel {
  /**
   * 사용자 식별자
   *
   * @example 1
   */
  idx: number;

  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/user123/profile.jpg"
   */
  profileImagePath: string | null;

  /**
   * 계정 생성일
   *
   * @example "2025-03-07T08:50:21.451Z"
   */
  createdAt: Date;

  /**
   * 권한 인증처
   */
  provider: null;

  constructor(data: ManagedUserModel) {
    Object.assign(this, data);
  }

  public static formPrisma(managedUser: SelectManagedUser): ManagedUserModel {
    return new ManagedUserModel({
      idx: managedUser.idx,
      nickname: managedUser.nickname,
      profileImagePath: managedUser.profileImagePath,
      createdAt: managedUser.createdAt,
      provider: null,
    });
  }
}
