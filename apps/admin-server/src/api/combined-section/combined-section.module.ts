import { Module } from '@nestjs/common';
import { CombinedSectionController } from './combined-section.controller';
import { CombinedSectionService } from './combined-section.service';
import { PlaceSectionCoreModule } from '@libs/core/place-section/place-section-core.module';
import { MagazineSectionCoreModule } from '@libs/core/magazine-section/magazine-section-core.module';

@Module({
  imports: [PlaceSectionCoreModule, MagazineSectionCoreModule],
  controllers: [CombinedSectionController],
  providers: [CombinedSectionService],
})
export class CombinedSectionModule {}
