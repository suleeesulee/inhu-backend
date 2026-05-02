import { MealOfferingModel } from '@libs/core/meal-offering/model/meal-offering.model';
import { SelectFoodStation } from './prisma-type/select-food-station';
import { MealType } from '../constants/meal-type.constant';

export class FoodStationModel {
  public idx: number;
  public cafeteriaIdx: number;
  public mealTypeIdx: MealType;
  public name: string;
  public startTime: Date;
  public endTime: Date;
  public startDate: Date;
  public endDate: Date;
  public createdAt: Date;
  public mealOfferingList: MealOfferingModel[];

  constructor(data: FoodStationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(foodStation: SelectFoodStation): FoodStationModel {
    return new FoodStationModel({
      idx: foodStation.idx,
      cafeteriaIdx: foodStation.cafeteriaIdx,
      mealTypeIdx: foodStation.mealTypeIdx as MealType,
      name: foodStation.name,
      startTime: foodStation.startTime,
      endTime: foodStation.endTime,
      startDate: foodStation.startDate,
      endDate: foodStation.endDate,
      createdAt: foodStation.createdAt,
      mealOfferingList: foodStation.mealOfferingList.map(
        MealOfferingModel.fromPrisma,
      ),
    });
  }
}
