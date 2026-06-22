import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_DAILY_MEMO,
  SelectDailyMemo,
} from './model/prisma-type/select-daily-memo';
import { CreateDailyMemoInput } from './inputs/create-daily-memo.input';
import { SelectDailyMemoAllInput } from './inputs/select-daily-memo-all.input';
import { UpdateDailyMemoInput } from './inputs/update-daily-memo.input';

@Injectable()
export class DailyMemoCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectDailyMemoByIdx(
    idx: number,
  ): Promise<SelectDailyMemo | null> {
    return await this.txHost.tx.dailyMemo.findUnique({
      ...SELECT_DAILY_MEMO,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectDailyMemoByCafeteriaIdxAndDate(
    cafeteriaIdx: number,
    date: string,
  ): Promise<SelectDailyMemo | null> {
    return await this.txHost.tx.dailyMemo.findFirst({
      ...SELECT_DAILY_MEMO,
      where: {
        cafeteriaIdx,
        date: `${date}T00:00:00Z`,
        deletedAt: null,
      },
    });
  }

  public async selectDailyMemoAll(
    input: SelectDailyMemoAllInput,
  ): Promise<SelectDailyMemo[]> {
    return await this.txHost.tx.dailyMemo.findMany({
      ...SELECT_DAILY_MEMO,
      where: {
        cafeteriaIdx: input.cafeteriaIdx,
        date: {
          gte: `${input.startDate}T00:00:00Z`,
          lte: `${input.endDate}T23:59:59Z`,
        },
        deletedAt: null,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  public async insertDailyMemo(
    input: CreateDailyMemoInput,
  ): Promise<SelectDailyMemo> {
    return await this.txHost.tx.dailyMemo.create({
      ...SELECT_DAILY_MEMO,
      data: {
        cafeteriaIdx: input.cafeteriaIdx,
        content: input.content,
        date: `${input.date}T00:00:00Z`,
      },
    });
  }

  public async updateDailyMemoByIdx(
    idx: number,
    input: UpdateDailyMemoInput,
  ): Promise<void> {
    await this.txHost.tx.dailyMemo.update({
      data: {
        content: input.content,
        date: input.date ? `${input.date}T00:00:00Z` : undefined,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async softDeleteDailyMemoByIdx(idx: number): Promise<void> {
    await this.txHost.tx.dailyMemo.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectDailyMemosForCopy(
    fromCafeteriaIdx: number,
    startDate: string,
    endDate: string,
  ): Promise<{ content: string; date: Date }[]> {
    return await this.txHost.tx.dailyMemo.findMany({
      select: {
        content: true,
        date: true,
      },
      where: {
        cafeteriaIdx: fromCafeteriaIdx,
        deletedAt: null,
        date: {
          gte: `${startDate}T00:00:00Z`,
          lte: `${endDate}T00:00:00Z`,
        },
      },
    });
  }

  public async insertDailyMemosForCopy(
    toCafeteriaIdx: number,
    memos: { content: string; date: Date }[],
  ): Promise<void> {
    await this.txHost.tx.dailyMemo.createMany({
      data: memos.map((memo) => ({
        cafeteriaIdx: toCafeteriaIdx,
        content: memo.content,
        date: memo.date,
      })),
    });
  }
}
