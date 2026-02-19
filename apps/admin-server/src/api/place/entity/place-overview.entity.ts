import { PickType } from '@nestjs/swagger';
import { PlaceEntity } from './place.entity';
import { PlaceRoadAddressEntity } from './place-road-address.entity';
import { KeywordEntity } from '@admin/api/keyword/entity/keyword.entity';
import { PlaceOverviewModel } from '@libs/core/place/model/place-overview.model';
import { FreeTagEntity } from '@admin/api/free-tag/entity/free-tag.entity';
import { SearchTagEntity } from '@admin/api/search-tag/entity/search-tag.entity';

export class PlaceOverviewEntity extends PickType(PlaceEntity, [
  'idx',
  'name',
  'roadAddress',
  'reviewCount',
  'topKeywordList',
  'imagePathList',
  'type',
  'activatedAt',
  'permanentlyClosedAt',
  'closedDayList',
  'operatingHourList',
  'weeklyClosedDayList',
  'breakTimeList',
  'mainCategoryList',
  'moodCategoryList',
  'typeList',
  'freeTagList',
  'searchTagList',
]) {
  constructor(data: PlaceOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: PlaceOverviewModel): PlaceOverviewEntity {
    return new PlaceOverviewEntity({
      idx: model.idx,
      name: model.name,
      roadAddress: PlaceRoadAddressEntity.fromModel(model.roadAddress),
      reviewCount: model.reviewCount,
      topKeywordList: model.topKeywordList.map(KeywordEntity.fromModel),
      imagePathList: model.imgPathList,
      type: model.type,
      activatedAt: model.activatedAt,
      permanentlyClosedAt: model.permanentlyClosedAt,
      closedDayList: model.closedDayList,
      operatingHourList: model.operatingHourList,
      weeklyClosedDayList: model.weeklyClosedDayList,
      breakTimeList: model.breakTimeList,
      mainCategoryList: model.mainCategoryList,
      moodCategoryList: model.moodCategoryList,
      typeList: model.typeList,
      freeTagList: model.freeTagList.map(FreeTagEntity.fromModel),
      searchTagList: model.searchTagList.map(SearchTagEntity.fromModel),
    });
  }
}
