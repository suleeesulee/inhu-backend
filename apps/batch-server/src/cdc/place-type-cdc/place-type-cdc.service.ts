import { Injectable } from '@nestjs/common';
import { PlaceTypeLogCoreService } from '@libs/log-core/place-type-log-core/place-type-log-core.service';
import { PlaceTypeTb } from './events/place-type-tb.event';

@Injectable()
export class PlaceTypeCdcService {
  constructor(
    private readonly placeTypeLogCoreService: PlaceTypeLogCoreService,
  ) {}

  public async createDimPlaceType(placeType: PlaceTypeTb, time: Date) {
    await this.placeTypeLogCoreService.createDimPlaceType(
      {
        idx: placeType.idx,
        content: placeType.content,
        deletedAt: placeType.deleted_at ? new Date(placeType.deleted_at) : null,
        registeredAt: new Date(placeType.created_at),
      },
      time,
    );
  }
}
