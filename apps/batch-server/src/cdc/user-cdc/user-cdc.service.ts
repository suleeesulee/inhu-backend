import { UserLogCoreService } from '@libs/log-core/user-log-core/user-log-core.service';
import { Injectable } from '@nestjs/common';
import { UserTb } from './events/user-tb.event';

@Injectable()
export class UserCdcService {
  constructor(private readonly userLogCoreService: UserLogCoreService) {}

  public async createDimUser(user: UserTb, time: Date) {
    await this.userLogCoreService.createDimUser(
      {
        idx: user.idx,
        signupAt: new Date(user.created_at),
        deletedAt: user.deleted_at ? new Date(user.deleted_at) : null,
        platform: user.platform,
        nickname: user.nickname,
        profileImgPath: user.profile_image_path,
      },
      time,
    );
  }
}
