import { PlaceVisitStatisticModel } from '@libs/core/place-visit/model/place-visit-statistic.model';
import { PlaceType } from '@libs/core/place/constants/place-type.constant';

export class PlaceVisitStatisticEntity {
  public placeType: PlaceType;
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
