import { CafeteriaModel } from '@libs/core/cafeteria/model/cafeteria.model';

export class CafeteriaEntity {
  /**
   * 식당 식별자
   *
   * @example 1
   */
  public idx: number;

  /**
   * 식당 이름
   *
   * @example "인하대학교 학생식당"
   */
  public name: string;

  /**
   * 생성 시간
   */
  public createdAt: Date;

  constructor(data: CafeteriaEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CafeteriaModel): CafeteriaEntity {
    return new CafeteriaEntity({
      idx: model.idx,
      name: model.name,
      createdAt: model.createdAt,
    });
  }
}
