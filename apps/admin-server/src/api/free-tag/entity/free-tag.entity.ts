import { FreeTagModel } from '@libs/core/free-tag/model/free-tag.model';

export class FreeTagEntity {
  /**
   * free tag idx
   *
   * @example 1
   */
  public idx: number;

  /**
   * free tag name
   *
   * @example '가성비 좋은'
   */
  public name: string;

  /**
   * 생성 날짜
   */
  public createdAt: Date;

  constructor(data: FreeTagEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: FreeTagModel): FreeTagEntity {
    return new FreeTagEntity({
      idx: model.idx,
      name: model.content,
      createdAt: model.createdAt,
    });
  }
}
