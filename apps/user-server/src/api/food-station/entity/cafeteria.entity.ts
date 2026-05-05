import { CafeteriaModel } from '@libs/core/cafeteria/model/cafeteria.model';

export class CafeteriaEntity {
  /**
   * 식당 식별 번호
   *
   * @example 1
   */
  public idx: number;

  /**
   * 식당 이름
   *
   * @example '인하대학교 학생식당'
   */
  public name: string;

  constructor(data: CafeteriaEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: CafeteriaModel): CafeteriaEntity {
    return new CafeteriaEntity({
      idx: model.idx,
      name: model.name,
    });
  }
}
