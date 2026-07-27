import { Module } from '@nestjs/common';
import { PlaceSectionCoreService } from './place-section-core.service';
import { PlaceSectionCoreRepository } from './place-section-core.repository';

@Module({
  providers: [PlaceSectionCoreService, PlaceSectionCoreRepository],
  exports: [PlaceSectionCoreService],
})
export class PlaceSectionCoreModule {}
