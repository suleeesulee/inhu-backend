import { OmitType } from '@nestjs/swagger';
import { PlaceRoadAddressEntity } from '@user/api/place/entity/place-road-address.entity';
import { KeywordEntity } from '@user/api/keyword/entity/keyword.entity';
import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';
import { PlaceOverviewEntity } from '@user/api/place/entity/place-overview.entity';

export class SectionPlaceOverviewEntity extends OmitType(PlaceOverviewEntity, [
  'bookmark',
]) {
  constructor(data: SectionPlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PlaceOverviewModel,
  ): SectionPlaceOverviewEntity {
    return new SectionPlaceOverviewEntity({
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
    });
  }
}
