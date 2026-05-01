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
    date: Date,
  ): Promise<SelectDailyMemo | null> {
    return await this.txHost.tx.dailyMemo.findFirst({
      ...SELECT_DAILY_MEMO,
      where: {
        cafeteriaIdx,
        date,
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
          gte: input.startDate,
          lte: input.endDate,
        },
        deletedAt: null,
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
        date: input.date,
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
        date: input.date,
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
}
