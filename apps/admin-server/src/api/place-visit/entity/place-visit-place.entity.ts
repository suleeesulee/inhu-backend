import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceRoadAddressEntity } from '@admin/api/place/entity/place-road-address.entity';
import { PlaceVisitPlaceModel } from '@libs/core/place-visit/model/place-visit-place.model';
import { PickType } from '@nestjs/swagger';

export class PlaceVisitPlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'imagePathList',
]) {
  constructor(data: PlaceVisitPlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceVisitPlaceModel): PlaceVisitPlaceEntity {
    return new PlaceVisitPlaceEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      imagePathList: model.imgPathList.map((path) => path),
    });
  }
}
