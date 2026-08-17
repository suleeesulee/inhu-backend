import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { SelectPlaceVisitStatistic } from './prisma-type/select-place-visit-statistic';

export class PlaceVisitStatisticModel {
  public placeType: PlaceType;
  public visitCount: number;

  constructor(data: PlaceVisitStatisticModel) {
    Object.assign(this, data);
  }

  public static fromQuery(
    data: SelectPlaceVisitStatistic,
  ): PlaceVisitStatisticModel {
    return new PlaceVisitStatisticModel({
      placeType: data.placeType,
      visitCount: data.visitCount,
    });
  }
}
