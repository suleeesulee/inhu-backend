import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUserOverviewAllDto } from './dto/request/get-user-overview-all.dto';
import { UserOverviewEntity } from './entity/user-overview.entity';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { GetAllUsersInput } from '@libs/core/user/inputs/get-user-overview.input';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userCoreService: UserCoreService) {}

  public async getUserAll(
    getUserOverviewDto: GetUserOverviewAllDto,
  ): Promise<{ userList: UserOverviewEntity[]; count: number }> {
    const input: GetAllUsersInput = {
      take: 10,
      skip: (getUserOverviewDto.page - 1) * 10,
    };

    const users = await this.userCoreService.getUserAll(input);

    return {
      userList: users.map(UserOverviewEntity.fromModel),
      count: await this.userCoreService.getUserOverviewCount(),
    };
  }

  public async getUserByIdx(idx: number): Promise<UserEntity> {
    const userModel = await this.userCoreService.getUserByIdx(idx);

    if (!userModel) {
      throw new NotFoundException('Cannot find user');
    }

    return UserEntity.fromModel(userModel);
  }
}
