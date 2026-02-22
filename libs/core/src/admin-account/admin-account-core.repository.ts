import {
  SELECT_ADMIN_ACCOUNT,
  SelectAdminAccount,
} from '@libs/core/admin-account/model/prisma-type/select-admin-account';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateAdminAccountInput } from './inputs/create-admin-account.input';
import { GetAdminAccountAllInput } from './inputs/get-admin-account-all.input';

@Injectable()
export class AdminAccountCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectAdminAccountCount(): Promise<number> {
    return await this.txHost.tx.adminAccount.count({
      where: {
        user: {
          deletedAt: null,
        },
      },
    });
  }

  public async selectAdminAccountAll(
    input: GetAdminAccountAllInput,
  ): Promise<SelectAdminAccount[]> {
    return await this.txHost.tx.adminAccount.findMany({
      select: SELECT_ADMIN_ACCOUNT.select,
      where: {
        user: {
          deletedAt: null,
        },
      },
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectAdminById(id: string): Promise<SelectAdminAccount | null> {
    return await this.txHost.tx.adminAccount.findFirst({
      select: SELECT_ADMIN_ACCOUNT.select,
      where: {
        id,
        user: {
          deletedAt: null,
        },
      },
    });
  }

  public async selectAdminByIdx(
    idx: number,
  ): Promise<SelectAdminAccount | null> {
    return await this.txHost.tx.adminAccount.findFirst({
      select: SELECT_ADMIN_ACCOUNT.select,
      where: {
        idx,
        user: {
          deletedAt: null,
        },
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
