import { SelectBookmarkedPlaceOverview } from './prisma-type/select-bookmarked-place-overview';
import { PlaceOverviewModel } from './place-overview.model';
import { PickType } from '@nestjs/swagger';
import { KeywordModel } from '@libs/core/keyword/model/keyword.model';
import { PlaceRoadAddressModel } from './place-road-address.model';
import { PlaceType } from '../constants/place-type.constant';
import { PlaceClosedDayModel } from './place-closed-day.model';
import { PlaceOperatingHourModel } from './place-operating-hour.model';
import { PlaceWeeklyClosedDayModel } from './place-weekly-closed-day.model';
import { PlaceBreakTimeModel } from './place-break-time.model';
import { MainCategory } from '@libs/core/category/constants/main-category.constant';
import { MoodCategory } from '@libs/core/category/constants/mood-category.constant';
import { FreeTagModel } from '@libs/core/free-tag/model/free-tag.model';
import { SearchTagModel } from '@libs/core/search-tag/model/search-tag.model';

/**
 * 북마크된 장소 개요 모델
 *
 * @publicApi
 */
export class BookmarkedPlaceOverviewModel extends PickType(PlaceOverviewModel, [
  'idx',
  'name',
  'tel',
  'reviewCount',
  'bookmarkCount',
  'isClosedOnHoliday',
  'createdAt',
  'permanentlyClosedAt',
  'hasNfc',
  'imgPathList',
  'activatedAt',
  'topKeywordList',
  'roadAddress',
  'type',
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
  public bookmarkAt: Date;

  constructor(data: BookmarkedPlaceOverviewModel) {
    super(data);
    Object.assign(this, data);
  }

  public static fromPrisma({
    place,
    createdAt,
  }: SelectBookmarkedPlaceOverview): BookmarkedPlaceOverviewModel {
    return new BookmarkedPlaceOverviewModel({
      idx: place.idx,
      name: place.name,
      tel: place.tel,
      reviewCount: place.reviewCount,
      bookmarkCount: place.bookmarkCount,
      isClosedOnHoliday: place.isClosedOnHoliday,
      createdAt: place.createdAt,
      activatedAt: place.activatedAt,
      permanentlyClosedAt: place.permanentlyClosedAt,
      hasNfc: place.nfcList.length > 0,
      imgPathList: place.placeImageList.map((image) => image.path),
      topKeywordList: place.placeKeywordCountList.map(({ keyword }) =>
        KeywordModel.fromPrisma(keyword),
      ),
      bookmarkAt: createdAt,
      type: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx,
      )[0] as PlaceType,
      roadAddress: PlaceRoadAddressModel.fromPrisma(place.roadAddress),
      closedDayList: place.closedDayList.map(PlaceClosedDayModel.fromPrisma),
      operatingHourList: place.operatingHourList.map(
        PlaceOperatingHourModel.fromPrisma,
      ),
      weeklyClosedDayList: place.weeklyClosedDayList.map(
        PlaceWeeklyClosedDayModel.fromPrisma,
      ),
      breakTimeList: place.breakTimeList.map(PlaceBreakTimeModel.fromPrisma),
      mainCategoryList: place.placeMainCategoryMappingList.map(
        ({ mainCategoryIdx }) => mainCategoryIdx as MainCategory,
      ),
      moodCategoryList: place.placeMoodCategoryMappingList.map(
        ({ moodCategoryIdx }) => moodCategoryIdx as MoodCategory,
      ),
      typeList: place.placeTypeMappingList.map(
        ({ placeTypeIdx }) => placeTypeIdx as PlaceType,
      ),
      freeTagList: place.placeFreeTagMappingList.map(({ freeTag }) =>
        FreeTagModel.fromPrisma(freeTag),
      ),
      searchTagList: place.placeSearchTagMappingList.map(({ searchTag }) =>
        SearchTagModel.fromPrisma(searchTag),
      ),
    });
  }
}
