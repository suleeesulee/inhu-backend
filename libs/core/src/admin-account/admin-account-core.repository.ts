import {
  SELECT_ADMIN_ACCOUNT,
  SelectAdminAccount,
} from '@libs/core/admin-account/model/prisma-type/select-admin-account';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateAdminAccountInput } from './inputs/create-admin-account.input';

@Injectable()
export class AdminAccountCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectAdminById(id: string): Promise<SelectAdminAccount | null> {
    return await this.txHost.tx.adminAccount.findFirst({
      where: {
        id,
      },
    });
  }

  public async selectAdminByIdx(
    idx: number,
  ): Promise<SelectAdminAccount | null> {
    return await this.txHost.tx.adminAccount.findFirst({
      where: {
        idx,
      },
    });
  }

  public async insertAdminAccount(
    input: CreateAdminAccountInput,
  ): Promise<SelectAdminAccount> {
    return await this.txHost.tx.user.create({
      ...SELECT_ADMIN_ACCOUNT,
      data: {
        nickname: input.nickname,
        adminAccount: {
          create: {
            id: input.id,
            pw: input.pw,
            role: input.role,
          },
        },
      },
    });
  }
}
