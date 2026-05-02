import { MealOfferingModel } from '@libs/core/meal-offering/model/meal-offering.model';
import { MealItemEntity } from './meal-item.entity';

export class MealOfferingEntity {
  /**
   * 학식 식별 번호
   *
   * @example 1
   */
  public idx: number;

  /**
   * 식당 식별 번호
   *
   * @example 1
   */
  public foodStationIdx: number;

  /**
   * 운영 시작 시간
   *
   * @example: "08:00:00"
   */
  public startTime: string;

  /**
   * 운영 종료 시간
   */
  public endTime: string;

  /**
   * 칼로리
   *
   * @example 500
   */
  public kcal: number | null;

  /**
   * 등록된 학식 날짜
   */
  public servedDate: string;

  /**
   * 학식 등록 일시
   */
  public createdAt: Date;

  /**
   * 학식 메뉴 리스트
   */
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
