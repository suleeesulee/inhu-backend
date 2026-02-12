import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimPlaceInput } from './inputs/create-dim-place.input';
import { CreateDimRoadAddressInput } from './inputs/create-dim-road-address.input';
import { CreateDimPlaceTypeMappingInput } from './inputs/create-dim-place-type-mapping.input';
import { CreateDimPlaceMainCategoryMappingInput } from './inputs/create-dim-place-main-category-mapping.input';
import { CreateDimPlaceMoodCategoryMappingInput } from './inputs/create-dim-place-mood-category-mapping.input';
import { CreateDimPlaceImageInput } from './inputs/create-dim-place-image.input';
import { CreateDimClosedDayInput } from './inputs/create-dim-closed-day.input';
import { CreateDimOperatingHourInput } from './inputs/create-dim-operating-hour.input';
import { CreateDimWeeklyClosedDayInput } from './inputs/create-dim-weekly-closed-day.input';
import { CreateDimBreakTimeInput } from './inputs/create-dim-break-time.input';

@Injectable()
export class PlaceLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimPlace(input: CreateInputWrapper<CreateDimPlaceInput>) {
    return await this.txHost.tx.dimPlaces.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        roadAddressIdx: input.roadAddressIdx,
        name: input.name,
        tel: input.tel,
        reviewCount: input.reviewCount,
        bookmarkCount: input.bookmarkCount,
        isClosedOnHoliday: input.isClosedOnHoliday,
        deletedAt: input.deletedAt,
        permanentlyClosedAt: input.permanentlyClosedAt,
        activatedAt: input.activatedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        roadAddressIdx: input.roadAddressIdx,
        name: input.name,
        tel: input.tel,
        reviewCount: input.reviewCount,
        bookmarkCount: input.bookmarkCount,
        isClosedOnHoliday: input.isClosedOnHoliday,
        deletedAt: input.deletedAt,
        permanentlyClosedAt: input.permanentlyClosedAt,
        activatedAt: input.activatedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimRoadAddress(
    input: CreateInputWrapper<CreateDimRoadAddressInput>,
  ) {
    return await this.txHost.tx.dimRoadAddresses.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        addressName: input.addressName,
        detailAddress: input.detailAddress,
        addressX: input.addressX,
        addressY: input.addressY,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        addressName: input.addressName,
        detailAddress: input.detailAddress,
        addressX: input.addressX,
        addressY: input.addressY,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimPlaceTypeMapping(
    input: CreateInputWrapper<CreateDimPlaceTypeMappingInput>,
  ) {
    return await this.txHost.tx.dimPlaceTypeMappings.upsert({
      where: {
        placeTypeIdx_placeIdx_validFrom: {
          placeTypeIdx: input.placeTypeIdx,
          placeIdx: input.placeIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        placeTypeIdx: input.placeTypeIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        placeTypeIdx: input.placeTypeIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimPlaceMainCategoryMapping(
    input: CreateInputWrapper<CreateDimPlaceMainCategoryMappingInput>,
  ) {
    return await this.txHost.tx.dimPlaceMainCategoryMappings.upsert({
      where: {
        mainCategoryIdx_placeIdx_validFrom: {
          mainCategoryIdx: input.mainCategoryIdx,
          placeIdx: input.placeIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        mainCategoryIdx: input.mainCategoryIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        mainCategoryIdx: input.mainCategoryIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimPlaceMoodCategoryMapping(
    input: CreateInputWrapper<CreateDimPlaceMoodCategoryMappingInput>,
  ) {
    return await this.txHost.tx.dimPlaceMoodCategoryMappings.upsert({
      where: {
        moodCategoryIdx_placeIdx_validFrom: {
          moodCategoryIdx: input.moodCategoryIdx,
          placeIdx: input.placeIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        moodCategoryIdx: input.moodCategoryIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        moodCategoryIdx: input.moodCategoryIdx,
        placeIdx: input.placeIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimPlaceImage(
    input: CreateInputWrapper<CreateDimPlaceImageInput>,
  ) {
    return await this.txHost.tx.dimPlaceImages.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        imagePath: input.imagePath,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        imagePath: input.imagePath,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimClosedDay(
    input: CreateInputWrapper<CreateDimClosedDayInput>,
  ) {
    return await this.txHost.tx.dimClosedDays.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        day: input.day,
        week: input.week,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        day: input.day,
        week: input.week,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimOperatingHour(
    input: CreateInputWrapper<CreateDimOperatingHourInput>,
  ) {
    return await this.txHost.tx.dimOperatingHours.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        startAt: input.startAt,
        endAt: input.endAt,
        day: input.day,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        startAt: input.startAt,
        endAt: input.endAt,
        day: input.day,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimWeeklyClosedDay(
    input: CreateInputWrapper<CreateDimWeeklyClosedDayInput>,
  ) {
    return await this.txHost.tx.dimWeeklyClosedDays.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        closedDate: input.closedDate,
        type: input.type,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        closedDate: input.closedDate,
        type: input.type,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimBreakTime(
    input: CreateInputWrapper<CreateDimBreakTimeInput>,
  ) {
    return await this.txHost.tx.dimBreakTimes.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        startAt: input.startAt,
        endAt: input.endAt,
        day: input.day,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        startAt: input.startAt,
        endAt: input.endAt,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }
}
