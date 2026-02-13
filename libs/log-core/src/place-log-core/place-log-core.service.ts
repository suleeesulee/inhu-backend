import { Injectable } from '@nestjs/common';
import { PlaceLogCoreRepository } from './place-log-core.repository';
import { CreateDimPlaceInput } from './inputs/create-dim-place.input';
import { CreateDimRoadAddressInput } from './inputs/create-dim-road-address.input';
import { CreateDimPlaceImageInput } from './inputs/create-dim-place-image.input';
import { CreateDimClosedDayInput } from './inputs/create-dim-closed-day.input';
import { CreateDimOperatingHourInput } from './inputs/create-dim-operating-hour.input';
import { CreateDimWeeklyClosedDayInput } from './inputs/create-dim-weekly-closed-day.input';
import { CreateDimBreakTimeInput } from './inputs/create-dim-break-time.input';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateBridgePlaceTypeInput } from './inputs/create-bridge-place-type.input';
import { CreateBridgeMainCategoryInput } from './inputs/create-bridge-main-category.input';
import { CreateBridgeMoodCategoryInput } from './inputs/create-bridge-mood-category.input';

@Injectable()
export class PlaceLogCoreService {
  constructor(
    private readonly placeLogCoreRepository: PlaceLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimPlace(input: CreateDimPlaceInput, updatedAt: Date) {
    await this.placeLogCoreRepository.insertDimPlace({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimRoadAddress(
    input: CreateDimRoadAddressInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimRoadAddress({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createBridgePlaceType(
    input: CreateBridgePlaceTypeInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimPlaceTypeMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createBridgeMainCategory(
    input: CreateBridgeMainCategoryInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimPlaceMainCategoryMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createBridgeMoodCategory(
    input: CreateBridgeMoodCategoryInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimPlaceMoodCategoryMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimPlaceImage(
    input: CreateDimPlaceImageInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimPlaceImage({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimClosedDay(
    input: CreateDimClosedDayInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimClosedDay({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimOperatingHour(
    input: CreateDimOperatingHourInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimOperatingHour({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimWeeklyClosedDay(
    input: CreateDimWeeklyClosedDayInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimWeeklyClosedDay({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimBreakTime(
    input: CreateDimBreakTimeInput,
    updatedAt: Date,
  ) {
    await this.placeLogCoreRepository.insertDimBreakTime({
      ...input,
      validFrom: updatedAt,
    });
  }
}
