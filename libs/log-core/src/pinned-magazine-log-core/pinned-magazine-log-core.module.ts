import { Module } from '@nestjs/common';
import { PinnedMagazineLogCoreService } from './pinned-magazine-log-core.service';
import { PinnedMagazineLogCoreRepository } from './pinned-magazine-log-core.repository';

@Module({
  imports: [],
  providers: [PinnedMagazineLogCoreService, PinnedMagazineLogCoreRepository],
  exports: [PinnedMagazineLogCoreService],
})
export class PinnedMagazineLogCoreModule {}
