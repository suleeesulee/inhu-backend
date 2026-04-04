import { PlaceSectionCoreModule } from '@libs/core/place-section/place-section-core.module';
import { Module } from '@nestjs/common';
import { PlaceSectionController } from './place-section.controller';
import { PlaceSectionService } from './place-section.service';
import { PlaceSectionV2Controller } from './place-section-v2.controller';
import { MagazineSectionCoreModule } from '@libs/core/magazine-section/magazine-section-core.module';

@Module({
  imports: [PlaceSectionCoreModule, MagazineSectionCoreModule],
  controllers: [PlaceSectionController, PlaceSectionV2Controller],
  providers: [PlaceSectionService],
  exports: [PlaceSectionService],
})
export class PlaceSectionModule {}
