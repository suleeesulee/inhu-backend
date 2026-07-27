import { UserProviderEntity } from './user-provider.entity';
import { UserModel } from '@libs/core/user/model/user.model';

export class UserEntity {
  /**
   * 사용자 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 사용자 닉네임
   *
   * @example "heeju"
   */
  public nickname: string;

  /**
   * 프로필 이미지 경로
   *
   * @example "/profile/image.jpg"
   */
  public profileImagePath: string | null;

  /**
   * 권한 인증처
   */
  public provider: UserProviderEntity | null;

  /**
   * 학교 이메일
   *
   * @example "user@university.edu"
   */
  public schoolEmail: string | null;

  /**
   * 학교 인증 여부
   *
   * @example false
   */
  public isSchoolVerified: boolean;

  /**
   * 계정 생성일
   *
   * @example "2025-07-25T14:49:21.451Z"
   */
  public createdAt: Date;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: UserModel): UserEntity {
    return new UserEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
      provider: model.provider,
      schoolEmail: model.schoolEmail,
      isSchoolVerified: model.isSchoolVerified,
      createdAt: model.createdAt,
    });
  }
}
