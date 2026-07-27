import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  SELECT_MANAGED_USER,
  SelectManagedUser,
} from './model/prisma-type/select-managed-user';
import { CreateManagedUserInput } from './inputs/create-managed-user.input';
import { UpdateManagedUserInput } from './inputs/update-managed-user.input';
import { GetManagedUserOverviewInput } from './inputs/get-managed-user-overview.input';

@Injectable()
export class ManagedUserCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectManagedUserByIdx(
    idx: number,
  ): Promise<SelectManagedUser | null> {
    return await this.txHost.tx.user.findUnique({
      select: SELECT_MANAGED_USER.select,
      where: { idx, deletedAt: null, adminAccount: null, userProvider: null },
    });
  }

  public async selectManagedUserAll(
    input: GetManagedUserOverviewInput,
  ): Promise<SelectManagedUser[]> {
    return await this.txHost.tx.user.findMany({
      select: SELECT_MANAGED_USER.select,
      where: { deletedAt: null, adminAccount: null, userProvider: null },
      orderBy: { idx: 'desc' },
      skip: input.skip,
      take: input.take,
    });
  }

  public async selectManagedUserCount(
    input: GetManagedUserOverviewInput,
  ): Promise<number> {
    return await this.txHost.tx.user.count({
      where: { deletedAt: null, adminAccount: null, userProvider: null },
    });
  }

  public async insertManagedUser(
    input: CreateManagedUserInput,
  ): Promise<SelectManagedUser> {
    return await this.txHost.tx.user.create({
      select: SELECT_MANAGED_USER.select,
      data: {
        nickname: input.nickname,
        profileImagePath: input.profileImagePath,
      },
    });
  }

  public async updateManagedUserByIdx(
    idx: number,
    input: UpdateManagedUserInput,
  ) {
    return await this.txHost.tx.user.update({
      where: { idx, deletedAt: null, adminAccount: null, userProvider: null },
      data: {
        nickname: input.nickname,
        profileImagePath: input.profileImagePath,
      },
    });
  }

  public async deleteManagedUserByIdx(idx: number) {
    await this.txHost.tx.user.update({
      where: { idx, deletedAt: null, adminAccount: null, userProvider: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
