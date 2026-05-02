import { MealType } from '../constants/meal-type.constant';

export class CreateFoodStationInput {
  public cafeteriaIdx: number;
  public mealTypeIdx: MealType;
  public name: string;
  public startTime: string;
  public endTime: string;
  public startDate: string;
  public endDate: string;
}
