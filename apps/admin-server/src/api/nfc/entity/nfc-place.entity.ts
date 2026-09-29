import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { PlaceRoadAddressEntity } from '@admin/api/place/entity/place-road-address.entity';
import { NfcPlaceModel } from '@libs/core/nfc/model/nfc-place.model';
import { PickType } from '@nestjs/swagger';

export class NfcPlaceEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'imagePathList',
]) {
  constructor(data: NfcPlaceEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: NfcPlaceModel): NfcPlaceEntity {
    return new NfcPlaceEntity({
      idx: model.idx,
      name: model.name,
      tel: model.tel,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      imagePathList: model.imgPathList,
    });
  }
}
