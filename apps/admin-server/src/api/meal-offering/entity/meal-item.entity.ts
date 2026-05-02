import { MealItemModel } from '@libs/core/meal-offering/model/meal-item.model';

export class MealItemEntity {
  public idx: number;
  public name: string;
  public price: number | null;
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
