import { PlaceVisitStatisticModel } from '@libs/core/place-visit/model/place-visit-statistic.model';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class PlaceVisitStatisticEntity {
  /**
   * 방문 장소 타입
   *
   * @example 1
   */
  public placeType: PlaceType;

  /**
   * 방문 장소 타입별 방문 횟수
   *
   * @example 5
   */
  public visitCount: number;

  constructor(data: PlaceVisitStatisticEntity) {
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceVisitStatisticModel,
  ): PlaceVisitStatisticEntity {
    return new PlaceVisitStatisticEntity({
      placeType: model.placeType,
      visitCount: model.visitCount,
    });
  }
}
