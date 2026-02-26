import { Module } from '@nestjs/common';
import { PinnedMagazineCdcController } from './pinned-magazine-cdc.controller';
import { PinnedMagazineCdcService } from './pinned-magazine-cdc.service';
import { PinnedMagazineLogCoreModule } from '@libs/log-core/pinned-magazine-log-core/pinned-magazine-log-core.module';

@Module({
  imports: [PinnedMagazineLogCoreModule],
  controllers: [PinnedMagazineCdcController],
  providers: [PinnedMagazineCdcService],
})
export class PinnedMagazineCdcModule {}
