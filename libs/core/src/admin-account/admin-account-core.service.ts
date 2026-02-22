import { AdminAccountCoreRepository } from '@libs/core/admin-account/admin-account-core.repository';
import { AdminAccountModel } from '@libs/core/admin-account/model/admin-account.model';
import { Injectable } from '@nestjs/common';
import { CreateAdminAccountInput } from './inputs/create-admin-account.input';

/**
 * 관리자 계정 코어 서비스
 *
 * @publicApi
 */
@Injectable()
export class AdminAccountCoreService {
  constructor(
    private readonly adminAccountCoreRepository: AdminAccountCoreRepository,
  ) {}

  public async getAdminAccountById(
    id: string,
  ): Promise<AdminAccountModel | null> {
    const account = await this.adminAccountCoreRepository.selectAdminById(id);

    return account && AdminAccountModel.fromPrisma(account);
  }

  public async getAdminAccountByIdx(
    idx: number,
  ): Promise<AdminAccountModel | null> {
    const account = await this.adminAccountCoreRepository.selectAdminByIdx(idx);

    return account && AdminAccountModel.fromPrisma(account);
  }

  public async createAdminAccount(
    input: CreateAdminAccountInput,
  ): Promise<AdminAccountModel> {
    return AdminAccountModel.fromPrisma(
      await this.adminAccountCoreRepository.insertAdminAccount(input),
    );
  }
}
