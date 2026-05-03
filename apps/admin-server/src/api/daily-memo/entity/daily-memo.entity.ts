import { DailyMemoModel } from '@libs/core/daily-memo/model/daily-memo.model';

export class DailyMemoEntity {
  /**
   * 메모 식별 번호
   *
   * @example 1
   */
  public idx: number;

  /**
   * 식당 식별 번호
   *
   * @example 1
   */
  public cafeteriaIdx: number;

  /**
   * 메모 내용
   *
   * @example "오늘은 김치찌개가 맛있어요!"
   */
  public content: string;

  /**
   * 등록된 메모 날짜
   *
   * @example "2026-04-26"
   */
  public date: string;

  /**
   * 메모 등록 일시
   */
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
