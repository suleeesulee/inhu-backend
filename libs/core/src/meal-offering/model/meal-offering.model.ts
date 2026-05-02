import { MealItemModel } from './meal-item.model';
import { SelectMealOffering } from './prisma-type/select-meal-offering';

export class MealOfferingModel {
  public idx: number;
  public foodStationIdx: number;
  public startTime: string;
  public endTime: string;
  public kcal: number | null;
  public servedDate: string;
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
      startTime: mealOffering.startTime
        .toISOString()
        .split('T')[1]
        .split('.')[0],
      endTime: mealOffering.endTime.toISOString().split('T')[1].split('.')[0],
      kcal: mealOffering.kcal,
      servedDate: mealOffering.servedDate.toISOString().split('T')[0],
      createdAt: mealOffering.createdAt,
      mealItemList: mealOffering.mealItemList.map(MealItemModel.fromPrisma),
    });
  }
}
