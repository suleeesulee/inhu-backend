import { ManagedUserModel } from '@libs/core/user/model/managed-user.model';
import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class ManagedUserEntity extends PickType(UserEntity, [
  'idx',
  'nickname',
  'profileImagePath',
  'createdAt',
]) {
  constructor(data: ManagedUserEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: ManagedUserModel): ManagedUserEntity {
    return new ManagedUserEntity({
      idx: model.idx,
      nickname: model.nickname,
      profileImagePath: model.profileImagePath,
      createdAt: model.createdAt,
    });
  }
}
