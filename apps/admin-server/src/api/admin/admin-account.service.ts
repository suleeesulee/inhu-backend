import { LoginAdmin } from '@admin/common/login-admin';
import { AdminAccountCoreService } from '@libs/core/admin-account/admin-account-core.service';
import { Injectable } from '@nestjs/common';
import { AdminAccountEntity } from './entity/admin-account.entity';
import { CreateAdminAccountDto } from './dto/request/create-admin-account.dto';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountCoreService: AdminAccountCoreService,
  ) {}

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
