import { PinnedMagazineLogCoreService } from '@libs/log-core/pinned-magazine-log-core/pinned-magazine-log-core.service';
import { Injectable } from '@nestjs/common';
import { PinnedMagazineTb } from './events/pinned-magazine-tb.event';

@Injectable()
export class PinnedMagazineCdcService {
  constructor(
    private readonly pinnedMagazineLogCoreService: PinnedMagazineLogCoreService,
  ) {}

  public async createDimPinnedMagazine(
    pinnedMagazine: PinnedMagazineTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.pinnedMagazineLogCoreService.createDimPinnedMagazine(
      {
        idx: pinnedMagazine.idx,
        registeredAt: new Date(pinnedMagazine.created_at),
        deletedAt,
      },
      time,
    );
  }
}
