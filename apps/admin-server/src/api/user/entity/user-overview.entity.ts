import { UserForAdminModel } from '@libs/core/user/model/user-for-admin.model';
import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserOverviewEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
  'provider',
  'schoolEmail',
  'isSchoolVerified',
  'createdAt',
] as const) {
  /**
   * 사용자가 작성한 리뷰 개수
   *
   * @example 12
   */
  public reviewCount: number;

  constructor(data: UserOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: UserForAdminModel): UserOverviewEntity {
    return new UserOverviewEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
      provider: model.provider,
      schoolEmail: model.schoolEmail,
      isSchoolVerified: model.isSchoolVerified,
      reviewCount: model.reviewCount,
      createdAt: model.createdAt,
    });
  }
}
