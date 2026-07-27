import { MealItemModel } from '@libs/core/meal-offering/model/meal-item.model';

export class MealItemEntity {
  /**
   * 메뉴 식별 번호
   *
   * @example 1
   */
  public idx: number;

  /**
   * 메뉴 이름
   *
   * @example "김치찌개"
   */
  public name: string;

  /**
   * 메뉴 가격
   *
   * @example 3000
   */
  public price: number | null;

  /**
   * 메뉴 등록 일시
   */
  public createdAt: Date;

  constructor(data: MealItemEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MealItemModel): MealItemEntity {
    return new MealItemEntity({
      idx: model.idx,
      name: model.name,
      price: model.price,
      createdAt: model.createdAt,
    });
  }
}
