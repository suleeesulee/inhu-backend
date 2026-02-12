import { PlaceLogCoreService } from '@libs/log-core/place-log-core/place-log-core.service';
import { Injectable } from '@nestjs/common';
import { PlaceTb } from './events/place-tb.event';
import { RoadAddressTb } from './events/road-address-tb.event';
import { PlaceTypeMappingTb } from './events/place-type-mapping-tb.event';
import { PlaceMainCategoryMappingTb } from './events/place-main-category-mapping-tb.event';
import { PlaceMoodCategoryMappingTb } from './events/place-mood-category-mapping-tb.event';
import { PlaceImageTb } from './events/place-image-tb.event';
import { ClosedDayTb } from './events/closed-day-tb.event';
import { OperatingHourTb } from './events/operating-hour-tb.event';
import { WeeklyClosedDayTb } from './events/weekly-closed-day-tb.event';
import { BreakTimeTb } from './events/break-time-tb.event';

@Injectable()
export class PlaceCdcService {
  constructor(private readonly placeLogCoreService: PlaceLogCoreService) {}

  public async createDimPlace(place: PlaceTb, time: Date) {
    await this.placeLogCoreService.createDimPlace(
      {
        idx: place.idx,
        roadAddressIdx: place.road_address_idx,
        name: place.name,
        tel: place.tel,
        reviewCount: place.review_count,
        bookmarkCount: place.bookmark_count,
        isClosedOnHoliday: place.is_closed_on_holiday,
        deletedAt: place.deleted_at ? new Date(place.deleted_at) : null,
        permanentlyClosedAt: place.permanently_closed_at
          ? new Date(place.permanently_closed_at)
          : null,
        activatedAt: place.activated_at ? new Date(place.activated_at) : null,
        registeredAt: new Date(place.created_at),
      },
      time,
    );
  }

  public async createDimRoadAddress(roadAddress: RoadAddressTb, time: Date) {
    await this.placeLogCoreService.createDimRoadAddress(
      {
        idx: roadAddress.idx,
        addressName: roadAddress.address_name,
        detailAddress: roadAddress.detail_address,
        addressX: roadAddress.address_x,
        addressY: roadAddress.address_y,
      },
      time,
    );
  }

  public async createDimPlaceTypeMapping(
    placeTypeMapping: PlaceTypeMappingTb,
    time: Date,
  ) {
    await this.placeLogCoreService.createDimPlaceTypeMapping(
      {
        placeTypeIdx: placeTypeMapping.place_type_idx,
        placeIdx: placeTypeMapping.place_idx,
        deletedAt: placeTypeMapping.deleted_at
          ? new Date(placeTypeMapping.deleted_at)
          : null,
      },
      time,
    );
  }

  public async createDimPlaceMainCategoryMapping(
    placeMainCategoryMapping: PlaceMainCategoryMappingTb,
    time: Date,
  ) {
    await this.placeLogCoreService.createDimPlaceMainCategoryMapping(
      {
        mainCategoryIdx: placeMainCategoryMapping.main_category_idx,
        placeIdx: placeMainCategoryMapping.place_idx,
        deletedAt: placeMainCategoryMapping.deleted_at
          ? new Date(placeMainCategoryMapping.deleted_at)
          : null,
      },
      time,
    );
  }

  public async createDimPlaceMoodCategoryMapping(
    placeMoodCategoryMapping: PlaceMoodCategoryMappingTb,
    time: Date,
  ) {
    await this.placeLogCoreService.createDimPlaceMoodCategoryMapping(
      {
        moodCategoryIdx: placeMoodCategoryMapping.mood_category_idx,
        placeIdx: placeMoodCategoryMapping.place_idx,
        deletedAt: placeMoodCategoryMapping.deleted_at
          ? new Date(placeMoodCategoryMapping.deleted_at)
          : null,
      },
      time,
    );
  }

  public async createDimPlaceImage(placeImage: PlaceImageTb, time: Date) {
    await this.placeLogCoreService.createDimPlaceImage(
      {
        idx: placeImage.idx,
        placeIdx: placeImage.place_idx,
        imagePath: placeImage.image_path,
        deletedAt: placeImage.deleted_at
          ? new Date(placeImage.deleted_at)
          : null,
        registeredAt: new Date(placeImage.created_at),
      },
      time,
    );
  }

  public async createDimClosedDay(closedDay: ClosedDayTb, time: Date) {
    await this.placeLogCoreService.createDimClosedDay(
      {
        idx: closedDay.idx,
        placeIdx: closedDay.place_idx,
        day: closedDay.day,
        week: closedDay.week,
        deletedAt: closedDay.deleted_at ? new Date(closedDay.deleted_at) : null,
      },
      time,
    );
  }

  public async createDimOperatingHour(
    operatingHour: OperatingHourTb,
    time: Date,
  ) {
    await this.placeLogCoreService.createDimOperatingHour(
      {
        idx: operatingHour.idx,
        placeIdx: operatingHour.place_idx,
        startAt: operatingHour.start_at,
        endAt: operatingHour.end_at,
        day: operatingHour.day,
        deletedAt: operatingHour.deleted_at
          ? new Date(operatingHour.deleted_at)
          : null,
      },
      time,
    );
  }

  public async createDimWeeklyClosedDay(
    weeklyClosedDay: WeeklyClosedDayTb,
    time: Date,
  ) {
    await this.placeLogCoreService.createDimWeeklyClosedDay(
      {
        idx: weeklyClosedDay.idx,
        placeIdx: weeklyClosedDay.place_idx,
        closedDate: weeklyClosedDay.closed_date,
        type: weeklyClosedDay.type,
        deletedAt: weeklyClosedDay.deleted_at
          ? new Date(weeklyClosedDay.deleted_at)
          : null,
      },
      time,
    );
  }

  public async createDimBreakTime(breakTime: BreakTimeTb, time: Date) {
    await this.placeLogCoreService.createDimBreakTime(
      {
        idx: breakTime.idx,
        placeIdx: breakTime.place_idx,
        startAt: breakTime.start_at,
        endAt: breakTime.end_at,
        day: breakTime.day,
        deletedAt: breakTime.deleted_at ? new Date(breakTime.deleted_at) : null,
      },
      time,
    );
  }
}
