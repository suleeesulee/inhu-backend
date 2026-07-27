import { ManagedUserCoreService } from '@libs/core/user/managed-user-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagedUserDto } from './dto/request/create-managed-user.dto';
import { ManagedUserEntity } from './entity/managed-user.entity';
import { GetManagedUserAllDto } from './dto/request/get-managed-user-all.dto';
import { UpdateManagedUserDto } from './dto/request/update-managed-user.dto';

@Injectable()
export class ManagedUserService {
  constructor(
    private readonly managedUserCoreService: ManagedUserCoreService,
  ) {}

  public async getManagedUserAll(dto: GetManagedUserAllDto) {
    const input = {
      take: 10,
      skip: (dto.page - 1) * 10,
    };

    const userList = await this.managedUserCoreService.getManagedUserAll(input);
    const count = await this.managedUserCoreService.getManagedUserCount(input);

    return {
      userList: userList.map(ManagedUserEntity.fromModel),
      count,
    };
  }

  public async getManagedUserByIdx(idx: number): Promise<ManagedUserEntity> {
    const user = await this.managedUserCoreService.getManagedUserByIdx(idx);

    if (!user) throw new NotFoundException('Cannot find managed user');

    return ManagedUserEntity.fromModel(user);
  }

  public async createManagedUser(
    dto: CreateManagedUserDto,
  ): Promise<ManagedUserEntity> {
    return ManagedUserEntity.fromModel(
      await this.managedUserCoreService.createManagedUser({
        nickname: dto.nickname,
        profileImagePath: dto.profileImagePath,
      }),
    );
  }

  public async updateManagedUserByIdx(
    idx: number,
    dto: UpdateManagedUserDto,
  ): Promise<void> {
    const user = await this.managedUserCoreService.getManagedUserByIdx(idx);

    if (!user) throw new NotFoundException('Cannot find managed user');

    return await this.managedUserCoreService.updateManagedUserByIdx(idx, {
      nickname: dto.nickname,
      profileImagePath: dto.profileImagePath,
    });
  }

  public async deleteManagedUserByIdx(idx: number): Promise<void> {
    const user = await this.managedUserCoreService.getManagedUserByIdx(idx);

    if (!user) throw new NotFoundException('Cannot find managed user');

    return await this.managedUserCoreService.deleteManagedUserByIdx(idx);
  }
}
