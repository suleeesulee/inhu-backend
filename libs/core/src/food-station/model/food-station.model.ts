import { MealOfferingModel } from '@libs/core/meal-offering/model/meal-offering.model';
import { SelectFoodStation } from './prisma-type/select-food-station';
import { MealType } from '../constants/meal-type.constant';

export class FoodStationModel {
  public idx: number;
  public cafeteriaIdx: number;
  public mealType: MealType;
  public name: string | null;
  public startTime: string;
  public endTime: string;
  public startDate: string;
  public endDate: string;
  public createdAt: Date;
  public mealOfferingList: MealOfferingModel[];

  constructor(data: FoodStationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(foodStation: SelectFoodStation): FoodStationModel {
    return new FoodStationModel({
      idx: foodStation.idx,
      cafeteriaIdx: foodStation.cafeteriaIdx,
      mealType: foodStation.mealTypeIdx as MealType,
      name: foodStation.name,
      startTime: foodStation.startTime
        .toISOString()
        .split('T')[1]
        .split('.')[0],
      endTime: foodStation.endTime.toISOString().split('T')[1].split('.')[0],
      startDate: foodStation.startDate.toISOString().split('T')[0],
      endDate: foodStation.endDate.toISOString().split('T')[0],
      createdAt: foodStation.createdAt,
      mealOfferingList: foodStation.mealOfferingList.map(
        MealOfferingModel.fromPrisma,
      ),
    });
  }
}
