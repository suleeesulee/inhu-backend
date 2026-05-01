import { DailyMemoModel } from '@libs/core/daily-memo/model/daily-memo.model';

export class DailyMemoEntity {
  public idx: number;
  public cafeteriaIdx: number;
  public content: string;
  public date: Date;
  public createdAt: Date;

  constructor(data: DailyMemoEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: DailyMemoModel): DailyMemoEntity {
    return new DailyMemoEntity({
      idx: model.idx,
      cafeteriaIdx: model.cafeteriaIdx,
      content: model.content,
      date: model.date,
      createdAt: model.createdAt,
    });
  }
}
