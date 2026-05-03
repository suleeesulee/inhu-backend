import { SelectMealItem } from './prisma-type/select-meal-item';

export class MealItemModel {
  public idx: number;
  public name: string;
  public price: number | null;
  public createdAt: Date;

  constructor(data: MealItemModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(mealItem: SelectMealItem): MealItemModel {
    return new MealItemModel({
      idx: mealItem.idx,
      name: mealItem.name,
      price: mealItem.price,
      createdAt: mealItem.createdAt,
    });
  }
}
