import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';
import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from '@user/api/place/entity/place.entity';

export class RouletteItemEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'imagePathList',
]) {
  public weight: number;

  constructor(data: RouletteItemEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceOverviewModel,
    weight: number,
  ): RouletteItemEntity {
    return new RouletteItemEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: model.roadAddress,
      imagePathList: model.imgPathList,
      weight,
    });
  }
}
