import { SelectDailyMemo } from './prisma-type/select-daily-memo';

export class DailyMemoModel {
  public idx: number;
  public cafeteriaIdx: number;
  public content: string;
  public date: string;
  public createdAt: Date;

  constructor(data: DailyMemoModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(dailyMemo: SelectDailyMemo): DailyMemoModel {
    return new DailyMemoModel({
      idx: dailyMemo.idx,
      cafeteriaIdx: dailyMemo.cafeteriaIdx,
      content: dailyMemo.content,
      date: dailyMemo.date.toISOString().split('T')[0],
      createdAt: dailyMemo.createdAt,
    });
  }
}
