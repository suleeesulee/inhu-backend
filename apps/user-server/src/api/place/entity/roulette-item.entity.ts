import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';
import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from '@user/api/place/entity/place.entity';
import { PlaceRoadAddressEntity } from './place-road-address.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';

export class RouletteItemEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'imagePathList',
  'type',
  'closedDayList',
  'operatingHourList',
  'weeklyClosedDayList',
  'breakTimeList',
  'mainCategoryList',
  'moodCategoryList',
  'typeList',
  'hasNfc',
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
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      reviewCount: model.reviewCount,
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      imagePathList: model.imgPathList,
      type: model.type,
      closedDayList: model.closedDayList,
      operatingHourList: model.operatingHourList,
      weeklyClosedDayList: model.weeklyClosedDayList,
      breakTimeList: model.breakTimeList,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
      typeList: model.typeList,
      hasNfc: model.hasNfc,
      weight,
    });
  }
}
