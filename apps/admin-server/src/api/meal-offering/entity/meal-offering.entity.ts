import { MealOfferingModel } from '@libs/core/meal-offering/model/meal-offering.model';
import { MealItemEntity } from './meal-item.entity';

export class MealOfferingEntity {
  public idx: number;
  public foodStationIdx: number;
  public startTime: Date;
  public endTime: Date;
  public kcal: number | null;
  public servedDate: Date;
  public createdAt: Date;
  public mealItemList: MealItemEntity[];

  constructor(data: MealOfferingEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: MealOfferingModel): MealOfferingEntity {
    return new MealOfferingEntity({
      idx: model.idx,
      foodStationIdx: model.foodStationIdx,
      startTime: model.startTime,
      endTime: model.endTime,
      kcal: model.kcal,
      servedDate: model.servedDate,
      createdAt: model.createdAt,
      mealItemList: model.mealItemList.map(MealItemEntity.fromModel),
    });
  }
}
