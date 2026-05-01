import { SelectDailyMemo } from './prisma-type/select-daily-memo';

export class DailyMemoModel {
  public idx: number;
  public cafeteriaIdx: number;
  public content: string;
  public date: Date;
  public createdAt: Date;

  constructor(data: DailyMemoModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(dailyMemo: SelectDailyMemo): DailyMemoModel {
    return new DailyMemoModel({
      idx: dailyMemo.idx,
      cafeteriaIdx: dailyMemo.cafeteriaIdx,
      content: dailyMemo.content,
      date: dailyMemo.date,
      createdAt: dailyMemo.createdAt,
    });
  }
}
