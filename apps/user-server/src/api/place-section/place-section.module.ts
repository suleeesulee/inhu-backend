import { PlaceSectionCoreModule } from '@libs/core/place-section/place-section-core.module';
import { Module } from '@nestjs/common';
import { PlaceSectionController } from './place-section.controller';
import { PlaceSectionService } from './place-section.service';

@Module({
  imports: [PlaceSectionCoreModule],
  controllers: [PlaceSectionController],
  providers: [PlaceSectionService],
  exports: [PlaceSectionService],
})
export class PlaceSectionModule {}
