import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  SELECT_SEARCH_TAG,
  SelectSearchTag,
} from './model/prisma-type/select-search-tag';

@Injectable()
export class SearchTagCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectSearchTagByIdx(
    idx: number,
  ): Promise<SelectSearchTag | null> {
    return await this.txHost.tx.searchTag.findUnique({
      ...SELECT_SEARCH_TAG,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectSearchTagByContent(
    content: string,
  ): Promise<SelectSearchTag | null> {
    return await this.txHost.tx.searchTag.findFirst({
      ...SELECT_SEARCH_TAG,
      where: {
        content,
        deletedAt: null,
      },
    });
  }

  public async selectSearchTagAllByContent(
    contentList?: string[],
  ): Promise<SelectSearchTag[]> {
    return await this.txHost.tx.searchTag.findMany({
      ...SELECT_SEARCH_TAG,
      where: {
        AND: [
          { deletedAt: null },
          this.getSearchContentWhereClause(contentList),
        ],
      },
    });
  }

  public async insertSearchTag(content: string): Promise<SelectSearchTag> {
    return await this.txHost.tx.searchTag.create({
      ...SELECT_SEARCH_TAG,
      data: {
        content,
      },
    });
  }

  public async insertManySearchTag(
    contentList: string[],
  ): Promise<SelectSearchTag[]> {
    return await this.txHost.tx.searchTag.createManyAndReturn({
      data: contentList.map((content) => ({ content })),
    });
  }

  public async softDeleteSearchTagByIdx(idx: number): Promise<void> {
    await this.txHost.tx.searchTag.update({
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
    contentList?: string[],
  ): Prisma.SearchTagWhereInput {
    if (!contentList || contentList.length === 0) {
      return {};
    }

    return {
      OR: contentList.map((content) => ({
        content: { equals: content },
      })),
    };
  }
}
