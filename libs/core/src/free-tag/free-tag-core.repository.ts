import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_FREE_TAG,
  SelectFreeTag,
} from './model/prisma-type/select-free-tag';

@Injectable()
export class FreeTagCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectFreeTagByIdx(idx: number): Promise<SelectFreeTag | null> {
    return await this.txHost.tx.freeTag.findUnique({
      ...SELECT_FREE_TAG,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectFreeTagAll(): Promise<SelectFreeTag[]> {
    return await this.txHost.tx.freeTag.findMany({
      ...SELECT_FREE_TAG,
      where: {
        deletedAt: null,
      },
    });
  }

  public async insertFreeTag(content: string): Promise<SelectFreeTag> {
    return await this.txHost.tx.freeTag.create({
      ...SELECT_FREE_TAG,
      data: {
        content,
      },
    });
  }

  public async softDeleteFreeTagByIdx(idx: number): Promise<void> {
    await this.txHost.tx.freeTag.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
