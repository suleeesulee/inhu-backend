import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_NOTICE,
  SelectNotice,
} from './model/prisma-type/select-notice';
import {
  SELECT_NOTICE_OVERVIEW,
  SelectNoticeOverview,
} from './model/prisma-type/select-notice-overview';
import { CreateNoticeInput } from './inputs/create-notice.input';
import { UpdateNoticeInput } from './inputs/update-notice.input';
import { GetAllNoticeInput } from './inputs/get-all-notice.input';

@Injectable()
export class NoticeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectNoticeByIdx(idx: number): Promise<SelectNotice | null> {
    return await this.txHost.tx.notice.findUnique({
      ...SELECT_NOTICE,
      where: { idx },
    });
  }

  public async selectNoticeAll(
    input: GetAllNoticeInput,
  ): Promise<SelectNoticeOverview[]> {
    return await this.txHost.tx.notice.findMany({
      ...SELECT_NOTICE_OVERVIEW,
      orderBy: { createdAt: 'desc' },
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectNoticeCount(): Promise<number> {
    return await this.txHost.tx.notice.count();
  }

  public async insertNotice(input: CreateNoticeInput): Promise<SelectNotice> {
    return await this.txHost.tx.notice.create({
      ...SELECT_NOTICE,
      data: {
        authorIdx: input.authorIdx,
        title: input.title,
        content: input.content,
      },
    });
  }

  public async updateNoticeByIdx(
    idx: number,
    input: UpdateNoticeInput,
  ): Promise<void> {
    await this.txHost.tx.notice.update({
      where: { idx },
      data: {
        title: input.title,
        content: input.content,
      },
    });
  }

  public async deleteNoticeByIdx(idx: number): Promise<void> {
    await this.txHost.tx.notice.delete({
      where: { idx },
    });
  }
}
