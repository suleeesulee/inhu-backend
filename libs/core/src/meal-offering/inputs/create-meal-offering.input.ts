export class CreateMealOfferingInput {
  public foodStationIdx: number;
  public startTime: string;
  public endTime: string;
  public kcal: number | null;
  public servedDate: string;
  public mealItemList: {
    name: string;
    price: number | null;
  }[];
}
