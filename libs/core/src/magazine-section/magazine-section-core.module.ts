import { Module } from '@nestjs/common';
import { MagazineSectionCoreService } from './magazine-section-core.service';
import { MagazineSectionCoreRepository } from './magazine-section-core.repository';

@Module({
  providers: [MagazineSectionCoreService, MagazineSectionCoreRepository],
  exports: [MagazineSectionCoreService],
})
export class MagazineSectionCoreModule {}
