import { MealType } from '@libs/core/food-station/constants/meal-type.constant';
import { FoodStationModel } from '@libs/core/food-station/model/food-station.model';
import { MealOfferingEntity } from './meal-offering.entity';

export class FoodStationEntity {
  /**
   * 코너 식별 변호
   *
   * @example 1
   */
  public idx: number;

  /**
   * 식당 식별 번호
   *
   * @example 1
   */
  public cafeteriaIdx: number;

  /**
   * 식사 분류 타입
   *
   * 1: 조식, 2: 중식, 3: 석식
   */
  public mealType: MealType;

  /**
   * 코너 이름
   *
   * @example '한식 코너'
   */
  public name: string | null;

  /**
   * 생성 날짜
   */
  public createdAt: Date;

  /**
   * 코너에 등록된 학식 리스트
   */
  public mealOffering: MealOfferingEntity;

  constructor(data: FoodStationEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: FoodStationModel): FoodStationEntity {
    return new FoodStationEntity({
      idx: model.idx,
      cafeteriaIdx: model.cafeteriaIdx,
      mealType: model.mealType,
      name: model.name,
      createdAt: model.createdAt,
      mealOffering: MealOfferingEntity.fromModel(model.mealOfferingList[0]),
    });
  }
}
