import { MagazineSectionCoreModule } from '@libs/core/magazine-section/magazine-section-core.module';
import { Module } from '@nestjs/common';
import { MagazineSectionController } from './magazine-section.controller';
import { MagazineSectionService } from './magazine-section.service';

@Module({
  imports: [MagazineSectionCoreModule],
  controllers: [MagazineSectionController],
  providers: [MagazineSectionService],
  exports: [MagazineSectionService],
})
export class MagazineSectionModule {}
