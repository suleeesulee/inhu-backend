import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { PlaceSectionCoreModule } from '@libs/core/place-section/place-section-core.module';
import { MagazineSectionCoreModule } from '@libs/core/magazine-section/magazine-section-core.module';

@Module({
  imports: [PlaceSectionCoreModule, MagazineSectionCoreModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
