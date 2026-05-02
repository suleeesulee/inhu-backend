import { MealItemModel } from './meal-item.model';
import { SelectMealOffering } from './prisma-type/select-meal-offering';

export class MealOfferingModel {
  public idx: number;
  public foodStationIdx: number;
  public startTime: Date;
  public endTime: Date;
  public kcal: number | null;
  public servedDate: Date;
  public createdAt: Date;
  public mealItemList: MealItemModel[];

  constructor(data: MealOfferingModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    mealOffering: SelectMealOffering,
  ): MealOfferingModel {
    return new MealOfferingModel({
      idx: mealOffering.idx,
      foodStationIdx: mealOffering.foodStationIdx,
      startTime: mealOffering.startTime,
      endTime: mealOffering.endTime,
      kcal: mealOffering.kcal,
      servedDate: mealOffering.servedDate,
      createdAt: mealOffering.createdAt,
      mealItemList: mealOffering.mealItemList.map(MealItemModel.fromPrisma),
    });
  }
}
