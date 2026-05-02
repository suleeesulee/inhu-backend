import { MealOfferingEntity } from '@admin/api/meal-offering/entity/meal-offering.entity';

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
  public mealTypeIdx: number;

  /**
   * 코너 이름
   *
   * @example '한식 코너'
   */
  public name: string;

  /**
   * 기본 운영 시작 시간
   *
   * @example '08:00:00'
   */
  public startTime: string;

  /**
   * 기본 운영 종료 시간
   *
   * @example '10:00:00'
   */
  public endTime: string;

  /**
   * 코너 운영 시작 날짜
   *
   * @example '2026-04-20'
   */
  public startDate: string;

  /**
   * 코너 운영 종료 날짜
   *
   * @example '2026-04-26'
   */
  public endDate: string;

  /**
   * 생성 날짜
   */
  public createdAt: Date;

  /**
   * 코너에 등록된 학식 리스트
   */
  public mealOfferingList: MealOfferingEntity[];

  constructor(data: FoodStationEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: FoodStationEntity): FoodStationEntity {
    return new FoodStationEntity({
      idx: model.idx,
      cafeteriaIdx: model.cafeteriaIdx,
      mealTypeIdx: model.mealTypeIdx,
      name: model.name,
      startTime: model.startTime,
      endTime: model.endTime,
      startDate: model.startDate,
      endDate: model.endDate,
      createdAt: model.createdAt,
      mealOfferingList: model.mealOfferingList.map(
        MealOfferingEntity.fromModel,
      ),
    });
  }
}
