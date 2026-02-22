import { LoginAdmin } from '@admin/common/login-admin';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Injectable } from '@nestjs/common';
import { AdminAccountEntity } from './entity/admin-account.entity';
import { CreateAdminAccountDto } from './dto/request/create-admin-account.dto';
import { GetAdminAccountAllDto } from './dto/request/get-admin-account-all.dto';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountCoreService: AdminAccountCoreService,
  ) {}

  /**
   * 모든 관리자 계정 조회
   */
  public async getAdminAccountAll(
    dto: GetAdminAccountAllDto,
  ): Promise<AdminAccountEntity[]> {
    return (
      await this.adminAccountCoreService.getAdminAccountAll({
        take: 10,
        skip: (dto.page - 1) * 10,
      })
    ).map(AdminAccountEntity.fromModel);
  }

  /**
   * 내 정보 조회
   */
  public async getAdminAccountByIdx(
    admin: LoginAdmin,
  ): Promise<AdminAccountEntity> {
    const adminModel = await this.adminAccountCoreService.getAdminAccountByIdx(
      admin.idx,
    );
    if (!adminModel) {
      throw new Error('Authenticated admin not found in database');
    }

    return AdminAccountEntity.fromModel(adminModel);
  }

  public async createAdminAccount(
    input: CreateAdminAccountDto,
  ): Promise<AdminAccountEntity> {
    return AdminAccountEntity.fromModel(
      await this.adminAccountCoreService.createAdminAccount(input),
    );
  }
}
