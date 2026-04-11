import { MagazineSectionCoreModule } from '@libs/core/magazine-section/magazine-section-core.module';
import { Module } from '@nestjs/common';
import { MagazineSectionController } from './magazine-section.controller';
import { MagazineSectionService } from './magazine-section.service';
import { PlaceSectionCoreModule } from '@libs/core/place-section/place-section-core.module';

@Module({
  imports: [MagazineSectionCoreModule, PlaceSectionCoreModule],
  controllers: [MagazineSectionController],
  providers: [MagazineSectionService],
  exports: [MagazineSectionService],
})
export class MagazineSectionModule {}
