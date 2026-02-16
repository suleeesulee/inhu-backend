import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_FREE_TAG,
  SelectFreeTag,
} from './model/prisma-type/select-free-tag';
import { Prisma } from '@prisma/client';

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

  public async selectFreeTagByContent(
    content: string,
  ): Promise<SelectFreeTag | null> {
    return await this.txHost.tx.freeTag.findFirst({
      ...SELECT_FREE_TAG,
      where: {
        content,
        deletedAt: null,
      },
    });
  }

  public async selectFreeTagAll(content?: string): Promise<SelectFreeTag[]> {
    return await this.txHost.tx.freeTag.findMany({
      ...SELECT_FREE_TAG,
      where: {
        AND: [{ deletedAt: null }, this.getSearchContentWhereClause(content)],
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

  private getSearchContentWhereClause(
    content?: string,
  ): Prisma.FreeTagWhereInput {
    if (!content) {
      return {};
    }

    const trimmedContent = content.trim();

    return {
      OR: [{ content: { startsWith: trimmedContent } }],
    };
  }
}
