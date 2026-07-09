import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';
import { SelectPlaceVisitPlace } from './prisma-type/select-place-visit-place';
import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';

export class PlaceVisitPlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'roadAddress',
  'imgPathList',
]) {
  constructor(data: PlaceVisitPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectPlaceVisitPlace): PlaceVisitPlaceModel {
    return new PlaceVisitPlaceModel({
      idx: place.idx,
      name: place.name,
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
      imgPathList: place.placeImageList.map(({ path }) => path),
    });
  }
}
