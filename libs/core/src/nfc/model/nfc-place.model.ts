import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { PlaceModel } from '@libs/core/place/model/place.model';
import { PickType } from '@nestjs/swagger';
import { SelectNfcPlace } from './prisma-type/select-nfc-place';

export class NfcPlaceModel extends PickType(PlaceModel, [
  'idx',
  'name',
  'tel',
  'roadAddress',
  'imgPathList',
]) {
  constructor(data: NfcPlaceModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(place: SelectNfcPlace): NfcPlaceModel {
    return new NfcPlaceModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
      imgPathList: place.placeImageList.map(({ path }) => path),
    });
  }
}
