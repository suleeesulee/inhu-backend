import { Injectable } from '@nestjs/common';
import { DailyMemoCoreRepository } from './daily-memo-core.repository';
import { DailyMemoModel } from './model/daily-memo.model';
import { SelectDailyMemoAllInput } from './inputs/select-daily-memo-all.input';
import { CreateDailyMemoInput } from './inputs/create-daily-memo.input';
import { UpdateDailyMemoInput } from './inputs/update-daily-memo.input';

@Injectable()
export class DailyMemoCoreService {
  constructor(
    private readonly dailyMemoCoreRepository: DailyMemoCoreRepository,
  ) {}

  public async getDailyMemoByIdx(idx: number): Promise<DailyMemoModel | null> {
    const dailyMemo =
      await this.dailyMemoCoreRepository.selectDailyMemoByIdx(idx);
    return dailyMemo && DailyMemoModel.fromPrisma(dailyMemo);
  }

  public async getDailyMemoByCafeteriaIdxAndDate(
    cafeteriaIdx: number,
    date: string,
  ): Promise<DailyMemoModel | null> {
    const dailyMemo =
      await this.dailyMemoCoreRepository.selectDailyMemoByCafeteriaIdxAndDate(
        cafeteriaIdx,
        date,
      );
    return dailyMemo && DailyMemoModel.fromPrisma(dailyMemo);
  }

  public async getDailyMemoAll(
    input: SelectDailyMemoAllInput,
  ): Promise<DailyMemoModel[]> {
    return (await this.dailyMemoCoreRepository.selectDailyMemoAll(input)).map(
      DailyMemoModel.fromPrisma,
    );
  }

  public async createDailyMemo(
    input: CreateDailyMemoInput,
  ): Promise<DailyMemoModel> {
    return DailyMemoModel.fromPrisma(
      await this.dailyMemoCoreRepository.insertDailyMemo(input),
    );
  }

  public async updateDailyMemoByIdx(
    idx: number,
    input: UpdateDailyMemoInput,
  ): Promise<void> {
    await this.dailyMemoCoreRepository.updateDailyMemoByIdx(idx, input);
  }

  public async deleteDailyMemoByIdx(idx: number): Promise<void> {
    await this.dailyMemoCoreRepository.softDeleteDailyMemoByIdx(idx);
  }
}
